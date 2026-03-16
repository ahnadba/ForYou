# Contributing

Thanks for contributing to ForYou.

## Before You Start
- Read `README.md` for setup.
- Follow project conventions in `AGENTS.md`.
- Keep changes beginner-friendly and avoid unnecessary rewrites.

## Workflow
1. Create a branch from your latest main/dev base.
2. Make small, focused commits.
3. Test your change locally.
4. Open a pull request with a clear description.

## Branch Naming
Use descriptive names, for example:
- `fix/category-filter`
- `fix/language-switcher`
- `ui/navbar-polish`

## Commit Message Examples
- `fix: category page uses categoryId endpoint`
- `fix: cart page language sync`
- `style: unify button hover states`

## Pull Request Checklist
- [ ] I verified the affected page/feature works.
- [ ] I did not break existing frontend/backend behavior.
- [ ] I kept naming and file references consistent.
- [ ] I updated docs when behavior changed.

## Code Style Notes
- Keep JavaScript readable and simple.
- Prefer shared utilities over duplicate logic.
- Keep frontend/backed naming consistent (`categoryId`, `productId`, `API_BASE_URL`).
- Add comments only for non-obvious logic.

## Reporting Issues
When opening an issue, include:
- What page/feature is affected
- Exact steps to reproduce
- Expected vs actual behavior
- Console error (if any)
- Screenshots when relevant

