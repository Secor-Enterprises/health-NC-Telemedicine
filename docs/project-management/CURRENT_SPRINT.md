# Current and Next Sprint Configuration

## Current Sprint

- Sprint: **Sprint 01**
- Controlled filter: `Sprint:"Sprint 01" -Workflow:"Done"`
- Layout: Board
- Group by: Workflow
- Sort by: Priority

## Next Sprint

- Sprint: **Sprint 02**
- Controlled filter: `Sprint:"Sprint 02" -Workflow:"Done"`
- Layout: Board
- Group by: Workflow
- Sort by: Priority

## Rollover procedure

At sprint close:

1. Move accepted work to `Workflow = Done`.
2. Re-plan unfinished work explicitly; do not silently carry it over.
3. Update Current Sprint to the next numbered sprint.
4. Update Next Sprint to the following numbered sprint.
5. Commit the revised filters to `.github/project-management/project.json`.
6. Record sprint review evidence and retrospective actions.
