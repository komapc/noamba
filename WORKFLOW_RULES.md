# Workflow Rules

## Critical Git Workflow Rules

### 🚨 NEVER WORK ON MASTER BRANCH WITHOUT EXPLICIT PERMISSION

**RULE**: Never work on the `master` branch without explicitly asking the user for permission first.

**Why**: 
- Master branch deploys to production automatically
- Prevents accidental production deployments
- Maintains proper git workflow practices
- Ensures user has control over production changes

**Workflow**:
1. Always work on `staging` branch or feature branches
2. Ask user permission before switching to master
3. Only merge to master after user approval
4. Never push directly to master without explicit request

**Example**:
```
❌ WRONG: "I'll switch to master and make changes"
✅ CORRECT: "Should I switch to master branch to make these changes?"
```

### Standard Workflow

1. **Development**: Work on `staging` branch
2. **Testing**: Test changes on staging environment
3. **Permission**: Ask user before merging to master
4. **Production**: Only deploy to master after explicit approval

### Branch Purposes

- **`staging`**: Development, testing, staging deployments
- **`master`**: Production-ready code, production deployments
- **Feature branches**: New features, experiments

### Version Management Reminder

- Always bump the version in both `src/script.js` (`CONFIG.VERSION`) and `src/index.html` (footer `span.version-small`) with every change.
- Follow semantic versioning (major.minor.patch). Patch for docs or minor fixes.

---

**Created**: January 2025  
**Status**: Active
