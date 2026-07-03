#!/usr/bin/env python3
# scrub-check.py — public leak-scan gate for the DirectiveForge kit's
# public-snapshot pipeline (v0.20.0 W2).
#
# WHY: before a snapshot goes public we must prove it carries ZERO client
# names, personal data, private paths, internal hosts, or secrets. This script
# is the release gate that proves it. It SHIPS PUBLICLY, so it embeds ONLY
# generic, public-safe patterns; the identifying pattern list (client/project
# names, personal inboxes, private hosts) is OPERATOR-HELD and passed at runtime
# via --patterns — that file lives under launch/private/ and is NEVER committed.
#
# Usage:
#   python3 scripts/scrub-check.py SNAPSHOT_DIR
#       [--patterns FILE ...] [--allow FILE] [--require-external]
#       [--format text|json] [--builtin-only] [--max-bytes N] [--allow-git]
#   python3 scripts/scrub-check.py --selftest
#
# Exit codes:
#   0  no hits (clean)
#   1  one or more hits found (leak)
#   2  usage / IO error (bad args, unreadable file, invalid regex,
#      --require-external with no --patterns supplied)
#
# python3 stdlib only (repo precedent: harness/layer2/check-links.py). POSIX.
import argparse
import fnmatch
import json
import os
import re
import sys

DEFAULT_MAX_BYTES = 5_000_000
BINARY_SNIFF_BYTES = 8192
VALID_CLASSES = ("NAME", "EMAIL", "PATH", "URL", "OPSLOCK", "SECRET", "OTHER")

# --- Builtin GENERIC set (public-safe; no client names, no personal data) ---
# Each entry: (CLASS, regex-source, case_sensitive). These are the patterns that
# ship. Anything identifying (who the client is) belongs in an external
# --patterns file, never here.
BUILTIN_SPECS = [
    # PATH — home dirs, session temp dirs, and the session-slug encoding
    ("PATH", r"/Users/[A-Za-z0-9._-]+/", False),
    ("PATH", r"/home/[A-Za-z0-9._-]+/", False),
    ("PATH", r"C:\\Users\\", False),
    ("PATH", r"/private/tmp/claude-\d+/", False),
    ("PATH", r"-Users-[A-Za-z0-9._-]+-Projects-", False),
    # EMAIL — personal-provider inboxes only (corporate domains are fine)
    ("EMAIL", r"[\w.+-]+@(gmail|icloud|yahoo|outlook|proton|protonmail|hotmail)\.[a-z]+", False),
    # URL — loopback / private-range hosts that leak a local dev environment
    ("URL", r"localhost:\d+", False),
    ("URL", r"127\.0\.0\.1", False),
    ("URL", r"192\.168\.\d+\.\d+", False),
    ("URL", r"\b10\.\d+\.\d+\.\d+\b", False),
    # SECRET — high-confidence credential shapes
    ("SECRET", r"sk-ant-[A-Za-z0-9-]+", False),
    ("SECRET", r"ghp_[A-Za-z0-9]+", False),
    ("SECRET", r"gho_[A-Za-z0-9]+", False),
    ("SECRET", r"AKIA[A-Z0-9]{16}", False),
    ("SECRET", r"xox[baprs]-[A-Za-z0-9-]+", False),
    ("SECRET", r"-----BEGIN [A-Z ]*PRIVATE KEY-----", False),
]


class UsageError(Exception):
    """Raised for anything that should exit 2 (bad args, IO, invalid regex)."""


class Pattern:
    """A compiled scan pattern with a human-traceable source label."""

    def __init__(self, klass, source_label, regex, case_sensitive):
        self.klass = klass
        self.source = source_label  # e.g. "builtin:3" or "scrub-patterns.txt:12"
        flags = 0 if case_sensitive else re.IGNORECASE
        try:
            self.rx = re.compile(regex, flags)
        except re.error as exc:
            raise UsageError(
                f"invalid regex from {source_label}: {regex!r} ({exc})"
            )


def build_builtins():
    """Compile the embedded generic pattern set."""
    out = []
    for idx, (klass, src, cs) in enumerate(BUILTIN_SPECS):
        out.append(Pattern(klass, f"builtin:{idx}", src, cs))
    return out


def parse_pattern_file(path):
    """Parse an operator-held CLASS<TAB>REGEX file.

    Case-insensitive by default; a regex prefixed with '!' is case-sensitive.
    '#' comments and blank lines ignored. Returns a list of Pattern.
    Invalid regex or malformed line -> UsageError naming the line.
    """
    basename = os.path.basename(path)
    out = []
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            lines = fh.readlines()
    except OSError as exc:
        raise UsageError(f"cannot read --patterns file {path}: {exc}")
    for lineno, raw in enumerate(lines, 1):
        line = raw.rstrip("\n")
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if "\t" not in line:
            raise UsageError(
                f"{basename}:{lineno}: expected CLASS<TAB>REGEX, no tab found: {line!r}"
            )
        klass, regex = line.split("\t", 1)
        klass = klass.strip()
        if klass not in VALID_CLASSES:
            raise UsageError(
                f"{basename}:{lineno}: unknown class {klass!r} "
                f"(valid: {', '.join(VALID_CLASSES)})"
            )
        case_sensitive = False
        if regex.startswith("!"):
            case_sensitive = True
            regex = regex[1:]
        if not regex:
            raise UsageError(f"{basename}:{lineno}: empty regex")
        out.append(Pattern(klass, f"{basename}:{lineno}", regex, case_sensitive))
    return out


class AllowRule:
    """One allowlist rule: suppress a hit iff BOTH path-glob AND text-regex match."""

    def __init__(self, glob, regex, reason, source_label):
        self.glob = glob
        self.reason = reason
        self.source = source_label
        try:
            self.rx = re.compile(regex)
        except re.error as exc:
            raise UsageError(
                f"invalid allowlist regex from {source_label}: {regex!r} ({exc})"
            )

    def suppresses(self, relpath, matched_text):
        return fnmatch.fnmatch(relpath, self.glob) and self.rx.search(matched_text)


def parse_allowlist(path):
    """Parse PATH_GLOB<TAB>REGEX<TAB>REASON. '#'/blank ignored."""
    basename = os.path.basename(path)
    out = []
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            lines = fh.readlines()
    except OSError as exc:
        raise UsageError(f"cannot read --allow file {path}: {exc}")
    for lineno, raw in enumerate(lines, 1):
        line = raw.rstrip("\n")
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 3:
            raise UsageError(
                f"{basename}:{lineno}: expected PATH_GLOB<TAB>REGEX<TAB>REASON: {line!r}"
            )
        glob, regex, reason = parts[0], parts[1], "\t".join(parts[2:])
        out.append(AllowRule(glob.strip(), regex, reason.strip(), f"{basename}:{lineno}"))
    return out


def mask(text):
    """Keep first + last char, star the middle, so scan logs never replicate a secret.

    'flamingo' -> 'f******o'; single/double chars are fully masked.
    """
    if len(text) <= 2:
        return "*" * len(text)
    return text[0] + "*" * (len(text) - 2) + text[-1]


def looks_binary(chunk):
    """Binary sniff: a NUL byte in the first 8KB."""
    return b"\x00" in chunk


def default_allowlist(snapshot_dir):
    """Pick a default allowlist. The shipping home is scripts/scrub-allowlist.txt
    (next to this scanner, so a public clone scans itself correctly); the lab's
    launch/ location is kept as a legacy fallback."""
    for cand in (
        os.path.join(snapshot_dir, "scripts", "scrub-allowlist.txt"),
        os.path.join("scripts", "scrub-allowlist.txt"),
        os.path.join(snapshot_dir, "launch", "scrub-allowlist.txt"),
        os.path.join("launch", "scrub-allowlist.txt"),
    ):
        if os.path.isfile(cand):
            return cand
    return None


def scan_text_lines(relpath, data, patterns, allow_rules):
    """Scan decoded text line-by-line. Returns (hits, suppressed_count)."""
    hits = []
    suppressed = 0
    text = data.decode("utf-8", errors="replace")
    for lineno, line in enumerate(text.split("\n"), 1):
        for pat in patterns:
            for m in pat.rx.finditer(line):
                matched = m.group(0)
                if not matched:
                    continue
                if any(r.suppresses(relpath, matched) for r in allow_rules):
                    suppressed += 1
                    continue
                hits.append({
                    "file": relpath,
                    "line": lineno,
                    "class": pat.klass,
                    "pattern": pat.source,
                    "masked": mask(matched),
                })
    return hits, suppressed


def scan_binary(relpath, data, patterns, allow_rules):
    """Scan raw bytes with utf-8-encoded patterns. Line is reported as '-'."""
    hits = []
    suppressed = 0
    for pat in patterns:
        try:
            brx = re.compile(pat.rx.pattern.encode("utf-8"), pat.rx.flags & ~re.UNICODE)
        except re.error:
            continue
        for m in brx.finditer(data):
            matched_bytes = m.group(0)
            if not matched_bytes:
                continue
            matched = matched_bytes.decode("utf-8", errors="replace")
            if any(r.suppresses(relpath, matched) for r in allow_rules):
                suppressed += 1
                continue
            hits.append({
                "file": relpath,
                "line": "-",
                "class": pat.klass,
                "pattern": pat.source,
                "masked": mask(matched),
            })
    return hits, suppressed


def run_scan(args):
    """Core scan. Returns a result dict; raises UsageError for exit-2 cases."""
    snapshot_dir = args.snapshot_dir
    if not os.path.isdir(snapshot_dir):
        raise UsageError(f"SNAPSHOT_DIR is not a directory: {snapshot_dir}")

    # --- assemble patterns ---
    if args.require_external and not args.patterns:
        raise UsageError(
            "--require-external set but no --patterns file supplied "
            "(refusing to run as a release gate on builtin patterns only)"
        )

    builtins = build_builtins()
    external = []
    external_counts = {}
    if not args.builtin_only:
        for pfile in args.patterns or []:
            pats = parse_pattern_file(pfile)
            external.extend(pats)
            external_counts[os.path.basename(pfile)] = len(pats)
    patterns = builtins + external

    # --- allowlist ---
    allow_path = args.allow
    allow_source_note = None
    if allow_path is None:
        allow_path = default_allowlist(snapshot_dir)
        if allow_path:
            allow_source_note = f"auto-detected {allow_path}"
    else:
        if not os.path.isfile(allow_path):
            raise UsageError(f"--allow file not found: {allow_path}")
        allow_source_note = f"explicit {allow_path}"
    allow_rules = parse_allowlist(allow_path) if allow_path else []

    # --- walk ---
    all_hits = []
    suppressed_total = 0
    scanned = 0
    skipped = []  # list of {"file":..., "reason":...}

    for root, dirs, files in os.walk(snapshot_dir):
        if not args.allow_git:
            dirs[:] = [d for d in dirs if d != ".git"]
        dirs.sort()
        for name in sorted(files):
            fpath = os.path.join(root, name)
            relpath = os.path.relpath(fpath, snapshot_dir)
            if os.path.islink(fpath):
                skipped.append({"file": relpath, "reason": "symlink"})
                continue
            try:
                size = os.path.getsize(fpath)
            except OSError as exc:
                skipped.append({"file": relpath, "reason": f"stat error: {exc}"})
                continue
            if size > args.max_bytes:
                skipped.append({
                    "file": relpath,
                    "reason": f"exceeds --max-bytes ({size} > {args.max_bytes})",
                })
                continue
            try:
                with open(fpath, "rb") as fh:
                    data = fh.read()
            except OSError as exc:
                skipped.append({"file": relpath, "reason": f"read error: {exc}"})
                continue
            scanned += 1
            if looks_binary(data[:BINARY_SNIFF_BYTES]):
                hits, supp = scan_binary(relpath, data, patterns, allow_rules)
            else:
                hits, supp = scan_text_lines(relpath, data, patterns, allow_rules)
            all_hits.extend(hits)
            suppressed_total += supp

    result = {
        "hits": all_hits,
        "suppressed": suppressed_total,
        "scanned": scanned,
        "skipped": skipped,
        "patterns": {"builtin": len(builtins), "external": len(external)},
        "exit": 1 if all_hits else 0,
        # extra fields for text summary (not required by the json contract keys above,
        # but harmless — json contract consumers read the named keys)
        "_external_counts": external_counts,
        "_allow_source": allow_source_note,
        "_allow_rules": len(allow_rules),
    }
    return result


def print_text_summary(result):
    """Human-readable summary + one line per hit."""
    hits = result["hits"]
    for h in hits:
        print(f"{h['file']}:{h['line']}:{h['class']}:{h['pattern']}:{h['masked']}")

    print("")
    print("--- scrub-check summary ---")
    print(f"files scanned : {result['scanned']}")
    print(f"files skipped : {len(result['skipped'])}")
    for s in result["skipped"]:
        print(f"    SKIPPED {s['file']} — {s['reason']}")
    # hits by class
    by_class = {}
    for h in hits:
        by_class[h["class"]] = by_class.get(h["class"], 0) + 1
    print(f"hits total    : {len(hits)}")
    for klass in VALID_CLASSES:
        if klass in by_class:
            print(f"    {klass}: {by_class[klass]}")
    if result["suppressed"]:
        note = result.get("_allow_source") or "allowlist"
        print(f"{result['suppressed']} hits suppressed by allowlist (see {note})")
    else:
        print("0 hits suppressed by allowlist")
    # patterns loaded
    print(f"patterns loaded: builtin={result['patterns']['builtin']}, "
          f"external={result['patterns']['external']}")
    for src, n in result.get("_external_counts", {}).items():
        print(f"    {src}: {n}")
    if result.get("_allow_source"):
        print(f"allowlist     : {result['_allow_source']} "
              f"({result.get('_allow_rules', 0)} rules)")
    else:
        print("allowlist     : none")
    print(f"exit          : {result['exit']}")


def print_json(result):
    """Emit the json contract on stdout, nothing else."""
    payload = {
        "hits": result["hits"],
        "suppressed": result["suppressed"],
        "scanned": result["scanned"],
        "skipped": result["skipped"],
        "patterns": result["patterns"],
        "exit": result["exit"],
    }
    print(json.dumps(payload))


# ------------------------- selftest -------------------------

def selftest():
    """Embedded unit checks: pattern parsing, masking, allowlist, binary sniff.

    Returns 0 on all-pass, 1 on any failure (prints each check).
    """
    failures = []

    def check(name, cond):
        status = "ok" if cond else "FAIL"
        print(f"[selftest] {status}: {name}")
        if not cond:
            failures.append(name)

    # masking
    check("mask('flamingo') == 'f******o'", mask("flamingo") == "f******o")
    check("mask('ab') fully starred", mask("ab") == "**")
    check("mask('a') fully starred", mask("a") == "*")
    check("mask('abc') == 'a*c'", mask("abc") == "a*c")

    # binary sniff
    check("looks_binary detects NUL", looks_binary(b"abc\x00def") is True)
    check("looks_binary clean text", looks_binary(b"plain text") is False)

    # builtins compile + match a home path
    builtins = build_builtins()
    check("builtins compiled (== len(BUILTIN_SPECS))",
          len(builtins) == len(BUILTIN_SPECS) and len(builtins) == 16)
    home_hit = any(p.rx.search("/Users" + "/alice/") for p in builtins if p.klass == "PATH")
    check("builtin PATH matches home-dir prefix", home_hit)
    email_pat = next(p for p in builtins if p.klass == "EMAIL")
    check("builtin EMAIL matches personal provider", bool(email_pat.rx.search("x@" + "gmail.com")))
    check("builtin EMAIL ignores corp domain",
          not email_pat.rx.search("x@example-corp.com"))

    # pattern-file parsing: valid line
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        pf = os.path.join(td, "p.txt")
        with open(pf, "w") as fh:
            fh.write("# comment\n\nNAME\tacme\nSECRET\t!CaseSensitive[0-9]+\n")
        pats = parse_pattern_file(pf)
        check("pattern-file parses 2 patterns", len(pats) == 2)
        check("case-insensitive default matches", bool(pats[0].rx.search("ACME")))
        check("bang-prefix is case-sensitive",
              pats[1].rx.search("casesensitive9") is None
              and bool(pats[1].rx.search("CaseSensitive9")))

        # unknown class -> UsageError
        badc = os.path.join(td, "badc.txt")
        with open(badc, "w") as fh:
            fh.write("BOGUS\tfoo\n")
        raised = False
        try:
            parse_pattern_file(badc)
        except UsageError:
            raised = True
        check("unknown class raises UsageError", raised)

        # missing tab -> UsageError
        notab = os.path.join(td, "notab.txt")
        with open(notab, "w") as fh:
            fh.write("NAME foo\n")
        raised = False
        try:
            parse_pattern_file(notab)
        except UsageError:
            raised = True
        check("missing tab raises UsageError", raised)

        # invalid regex -> UsageError
        badrx = os.path.join(td, "badrx.txt")
        with open(badrx, "w") as fh:
            fh.write("NAME\t(unclosed\n")
        raised = False
        try:
            parse_pattern_file(badrx)
        except UsageError:
            raised = True
        check("invalid regex raises UsageError", raised)

        # allowlist logic: both glob AND regex must match
        alf = os.path.join(td, "allow.txt")
        with open(alf, "w") as fh:
            fh.write("docs/*.md\t" + "/Users" + "/alice\ttest reason\n")
        rules = parse_allowlist(alf)
        check("allowlist parses 1 rule", len(rules) == 1)
        r = rules[0]
        check("allow suppresses on glob+text match",
              bool(r.suppresses("docs/a.md", "/Users" + "/alice")))
        check("allow does NOT suppress on wrong path",
              not r.suppresses("src/a.py", "/Users" + "/alice"))
        check("allow does NOT suppress on wrong text",
              not r.suppresses("docs/a.md", "/Users/bob"))

        # end-to-end text scan with suppression
        scan_dir = os.path.join(td, "snap")
        os.makedirs(os.path.join(scan_dir, "docs"))
        with open(os.path.join(scan_dir, "docs", "a.md"), "w") as fh:
            fh.write("path " + "/Users" + "/alice here\nand " + "/Users" + "/bob there\n")
        hits, supp = scan_text_lines(
            "docs/a.md",
            b"path " + b"/Users" + b"/alice/ here\nand " + b"/Users" + b"/bob/ there\n",
            [p for p in builtins if p.klass == "PATH"],
            rules,
        )
        # the alice path is suppressed by the allow rule; the bob path is a real hit
        check("scan suppresses allowed, keeps others",
              supp == 1 and len(hits) == 1 and hits[0]["masked"] == mask("/Users" + "/bob/"))

        # binary scan reports line '-'
        bhits, _ = scan_binary(
            "bin.dat",
            b"\x00\x01 sk-" + b"ant-ABC123 \x00",
            [p for p in builtins if p.klass == "SECRET"],
            [],
        )
        check("binary scan finds secret, line '-'",
              len(bhits) >= 1 and bhits[0]["line"] == "-")

    if failures:
        print(f"[selftest] {len(failures)} FAILURE(S): {', '.join(failures)}")
        return 1
    print("[selftest] all checks passed")
    return 0


# ------------------------- CLI -------------------------

def build_argparser():
    p = argparse.ArgumentParser(
        prog="scrub-check.py",
        description="Public leak-scan gate for the public-snapshot pipeline.",
    )
    p.add_argument("snapshot_dir", nargs="?",
                   help="directory to scan recursively")
    p.add_argument("--patterns", action="append", metavar="FILE",
                   help="operator-held external pattern file (CLASS<TAB>REGEX); repeatable")
    p.add_argument("--allow", metavar="FILE",
                   help="allowlist file (PATH_GLOB<TAB>REGEX<TAB>REASON)")
    p.add_argument("--require-external", action="store_true",
                   help="exit 2 if no --patterns supplied (prevents silent builtin-only gate)")
    p.add_argument("--format", choices=("text", "json"), default="text",
                   help="output format (default: text)")
    p.add_argument("--builtin-only", action="store_true",
                   help="ignore any --patterns; run builtin generic set only")
    p.add_argument("--max-bytes", type=int, default=DEFAULT_MAX_BYTES,
                   help=f"per-file scan cap (default: {DEFAULT_MAX_BYTES})")
    p.add_argument("--allow-git", action="store_true",
                   help="also scan .git/ (default: skipped)")
    p.add_argument("--selftest", action="store_true",
                   help="run embedded unit checks and exit")
    return p


def main(argv):
    args = build_argparser().parse_args(argv)

    if args.selftest:
        return selftest()

    if not args.snapshot_dir:
        print("error: SNAPSHOT_DIR is required (or use --selftest)", file=sys.stderr)
        return 2

    try:
        result = run_scan(args)
    except UsageError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    if args.format == "json":
        print_json(result)
    else:
        print_text_summary(result)
    return result["exit"]


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
