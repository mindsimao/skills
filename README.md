# Skills

Portable agent skills (`SKILL.md` format) for AI coding agents, covering dev setup, security housekeeping, branding and everyday automation.

Each skill is a folder with a `SKILL.md`: YAML front matter (`name`, `description`) followed by instructions, plus any reference files, scripts or assets it needs. Agents read the description to decide when a skill applies and load the rest only when they use it.

## Skills

| Skill | What it does |
|---|---|
| [`mindera-themes`](mindera-themes/SKILL.md) | Applies Mindera's brandbook themes to any web page or app: eight themes, brand fonts, glows, status and chart colours, and a theme picker. |
| [`software-audit`](software-audit/SKILL.md) | Audits a macOS or Windows machine for outdated, unsupported or vulnerable software, grouped by category, and suggests update commands without running them. |

## Installing

**Claude Code**: clone the repo as your user skills folder, so every skill is available in every project:

```bash
git clone <repo-url> ~/.claude/skills
```

To use only some of the skills, or to add them to a single project, copy the skill folders into `~/.claude/skills/` or `<project>/.claude/skills/` instead.

**Other agents**: copy the skill folders into the directory your agent loads skills from. The skills only use the standard `SKILL.md` layout, so they should work in any agent that supports it.

Once installed, an agent uses a skill when your request matches its description. You can also ask for one by name (in Claude Code, `/software-audit`).

## Private files

Some skills read local data that shouldn't be published. Those files are listed in `.gitignore`, and each one has a committed `.example` version to copy from:

| Skill | Private file | Template |
|---|---|---|
| `software-audit` | `references/known-flagged.md` (your vulnerability scan findings) | `references/known-flagged.example.md` |

## Adding a skill

1. Create a folder named after the skill, in kebab-case.
2. Add a `SKILL.md` with `name` and `description` front matter. In the description, say what the skill does and when to use it, because that's what the agent uses to choose it.
3. Put long reference material in `references/`, runnable helpers in `scripts/` and static files in `assets/`, and point to them from `SKILL.md`.
4. Add the skill to the table above. If it needs private data, add the file to `.gitignore` and commit an `.example` version.
