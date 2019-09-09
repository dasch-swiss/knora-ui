module.exports = {
    "dataSource": "milestones",
    "prefix": "",
    "changelogFilename": "CHANGELOG.md",
    "ignoreIssuesWith": [
        "duplicate",
        "wontfix",
        "invalid",
        "help wanted",
        "question",
        "testing"
    ],
    "template": {
        "issue": "- [{{text}}]({{url}}) {{name}}"
    },
    "groupBy": {
        "Breaking changes:": ["breaking/api", "breaking"],
        "Enhancements:": ["enhancement"],
        "Bug Fixes:": ["bug"],
        "Documentation:": ["documentation"],
        "Styling:": ["styling"],
        "Other:": ["chore", "refactor"]
    }
};
