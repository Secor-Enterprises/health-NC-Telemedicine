# Implementation Notes

The Project bootstrap is intentionally split into automated and manual responsibilities.

## Automated

- Create or update the controlled custom fields.
- Add all currently open repository issues to the Project.
- Verify custom-field completeness.
- Verify open-issue membership.
- Confirm Workflow exists.
- Confirm Milestone is available as a built-in Project field.
- Post verification evidence to issue #10.

## Manual once-off configuration

GitHub does not expose complete Project view creation through the supported CLI/API. The 12 controlled views must therefore be configured in the Project UI using `VIEW_CONFIGURATION_RUNBOOK.md`.

After the workflow posts the direct Project URL to issue #10, commit that exact URL to `PROJECT_URL.md` and the repository README or GitHub Project setup document.
