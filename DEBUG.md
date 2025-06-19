

## 2025.6.19
这样配置后，执行pnpm lefthook run pre-commit 或 git commit 时会一直卡死。
- 本意是git commit时触发pre-commit然后先走根目录的配置，然后通过run cd 进入子目录，执行里面的配置。
- 问题是子目录里没有单独的.git，也就是即便在子目录里执行`pnpm dlx lefthook run pre-commit` 最终也会向上寻找，回到根目录，然后就继续走到了根目录的lefthook.yml 从而造成了死循环

根目录的lefthook.yml
```yml
pre-commit:
  parallel: true 
  commands:
    admin-react-lint-check:
      glob: "admin-react/**/*"
      run: cd admin-react && pnpm dlx lefthook run pre-commit
commit-msg:
  commands:
    lint-commit-msg:
      run: pnpm commitlint --edit "$1"
      skip: [merge, rebase]      
```
admin-react的lefthook.yml
```yml
# SKIP CI in commit message to skip hooks
skip_output:
  - meta
  - success
  - summary

pre-commit:
  parallel: true
  commands:
    format:
      glob: "*.{js,jsx,ts,tsx,json,md}"
      run: pnpm dlx @biomejs/biome format --write --no-errors-on-unmatched {staged_files}
      stage_fixed: true
    lint:
      glob: "*.{js,jsx,ts,tsx}"
      run: pnpm dlx @biomejs/biome lint --no-errors-on-unmatched {staged_files}
    check-types:
      glob: "*.{ts,tsx}"
      run: pnpm dlx tsc --noEmit

commit-msg:
  commands:
    commitlint:
      run: pnpm dlx commitlint --edit "$1"
      # 允许空提交信息
      skip: [merge, rebase]

```