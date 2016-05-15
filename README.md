# jayin

<img width="90" height="20" src="https://fritx.github.io/51voa-cli/img/prs-welcome.svg">

Let's say you have a gitignore-like file:

```plain
# https://github.com/fritx/dotfiles
# .gitignore
*
!.gitignore
!README.md
!prs-welcome.svg
!.bashrc
!.bash_profile
!.exports
!.aliases
!.editorconfig
```

You want to cp the listed files to another folder.

Do it in bash?

```shell
files=$(cat .gitignore | sed /^\*$/d | sed s/\!//)
for file in $files; do cp $file ./dotfiles/; done

# or even
cat file | sed /^\*$/d | sed s/\!// \
  | while read -r file; do cp $file ./dotfiles/; done
```

<a href="https://github.com/fritx/jayin"><img width="213" height="211" src="wtf.jpg"></a>

WTF?

As a node.js developer, what if using just js flow/style?

```shell
cat .gitignore | js -ti 'x.trim().split(`\n`).slice(1).map(x => x.slice(1))' \
  | js -e 'exec(`cp ${x} ./dotfiles/`)'

# same as
cat .gitignore | js -ti 'x.trim().split(`\n`)' \
  | js 'x.slice(1)' \
  | js 'x.map(x => x.slice(1))' \
  | js -e 'exec(`cp ${x} ./dotfiles/`)'
```

Don't forget to take an alias if you want.

```shell
npm install -g jayin
alias js="jayin"
```

- `x`: current input value
- `i`: current index value (with -e)
- `exec(cmd)`: child_process.execSync(cmd)
- `-e`: for each
- `-ti`: input as text
- `-to`: output as text
- `-t`: input/output both as text

jayin is based on [through2](https://github.com/rvagg/through2).

If you've seen anything that is similar to this, don't hesitate to let me know ;)
