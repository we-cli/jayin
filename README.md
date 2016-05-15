# jayin

<img width="90" height="20" src="https://fritx.github.io/51voa-cli/img/prs-welcome.svg">&nbsp;&nbsp;<a href="https://circleci.com/gh/fritx/jayin/tree/dev"><img width="73" height="20" src="https://circleci.com/gh/fritx/jayin/tree/dev.svg?style=svg"></a>

假如你有一个类似于gitignore的文件:

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

你想要cp这些文件到另外一个文件夹。

用bash来搞？

```shell
files=$(cat .gitignore | sed /^\*$/d | sed s/\!//)
for file in $files; do cp $file ./dotfiles/; done

# or even
cat file | sed /^\*$/d | sed s/\!// \
  | while read -r file; do cp $file ./dotfiles/; done
```

<a href="https://github.com/fritx/jayin"><img width="213" height="211" src="wtf.jpg"></a>

瓦特？

作为一名node.js工程师，为什么不能用js流来处理呢？

```shell
cat .gitignore | js -ti 'x.trim().split(`\n`).slice(1).map(x => x.slice(1))' \
  | js -e 'exec(`cp ${x} ./dotfiles/`)'

# same as
cat .gitignore | js -ti 'x.trim().split(`\n`)' \
  | js 'x.slice(1)' \
  | js 'x.map(x => x.slice(1))' \
  | js -e 'exec(`cp ${x} ./dotfiles/`)'
```

不要忘了搞一个alias，如果你需要的话。

```shell
npm install -g jayin
alias js="jayin"
```

- `-ti`: 以文本的形式直接input，无需JSON.parse
- `-to`: 以文本的形式直接output，无需JSON.stringify
- `-t`: 以上两者
- `-e`: for each
- `x`: 当前的input内容
- `i`: current index value (with -e)
- `exec(cmd)`: child_process.execSync(cmd)

jayin基于[through2](https://github.com/rvagg/through2).

如果你发现已经早已有类似的东西存在，不妨告诉我一下 ;)
