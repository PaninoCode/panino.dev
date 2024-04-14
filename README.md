# PaninoWeb

My [website](https://panino.dev), built with a custom static site generator.

Most of the heavy lifting happens inside the `build.go` file, the `watch.sh` is used simply to watch file file changes and automatically rebuild (it's a temporary solution, one day I will code this feature directly inside the main Go script)

The code is very simple, just standard Go language, no external libraries do download or anything like that, but as it becomes more complex this might change in the future.

## Why?

Because I wanted to have a Single page app that could run on a classic static website hosting service without having to leverage custom configurations.

And also because I needed an excuse to try using Go in a project.

## Using this for yourself

If you want you can try to use this project to build your own website, but I don't suggest you do, a better option would be to use something like Hugo or 11ty.

Anyway, setting up the code building locally is extremely straightforward: Just clone this repo, create a config.json file in the repository root with this inside:

```json
{
    "build_path": "/path/to/build",
    "web_root": "http://localhost",
    "site_title": "Title"
}
```

and then launch either shell script (or use `go run build.go`) to start the build. It should take no more than a few seconds.

## Contributing

I'm not really looking for help with coding right now, but if you like what I'm making you are welcome to support me through my [Ko-fi page](https://ko-fi.com/PaninoCode) or [Neocities profile](https://neocities.org/site/paninodev)