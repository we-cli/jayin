# jayin

<a href="https://github.com/fritx/jayin"><img width="90" height="20" src="https://fritx.github.io/51voa-cli/img/prs-welcome.svg"></a>&nbsp;&nbsp;<a href="https://circleci.com/gh/fritx/jayin/tree/dev"><img width="73" height="20" src="https://circleci.com/gh/fritx/jayin/tree/dev.svg?style=svg"></a>

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

# thanks to @congeec, http://v2ex.com/t/278831#reply3
sed /^\*$/d .gitignore | sed s/\!// | xargs -I{} cp {} ./dotfiles/
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
  | js -e -c 'cp ${x} ./dotfiles/'
```

```shell
# lodash is also integrated in
# https://github.com/lodash/lodash
echo '[1,2,3,4]' | js '_.filter(x, x => x % 2)'  \
  | js '_.reverse(x)'  \
  > file

# or in chain
echo '[1,2,3,4]'  \
  | js '_(x).filter(x => x % 2).reverse().value()'  \
  > file
```

Don't forget to take an alias if you want.

```shell
npm install -g jayin
alias js="jayin"
```

- `-ti`: input as text, no more JSON.parse
- `-to`: output as text, no more JSON.stringify
- `-t`: input/output both as text
- `-e`: for each, in chain
- `-c`: shortcut of exec(cmd)
- `x`: current input value
- `i`: current index value (with -e)
- `_`: lodash
- `exec(cmd)`: child_process.execSync(cmd)

jayin is based on [through2](https://github.com/rvagg/through2).

If you've seen anything that is similar to this, don't hesitate to let me know ;)

# License

[MIT](https://github.com/fritx/jayin/blob/dev/LICENSE) License

Copyright (c) 2016-Present [Fritz Lin](https://github.com/fritx)
