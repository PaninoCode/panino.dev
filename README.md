# PaninoWeb

My <a href="https://panino.dev" target="_blank">website</a>, built with a custom static site generator.

Most of the heavy lifting happens inside the `build.go` file, the `watch.sh` is used simply to watch file file changes and automatically rebuild (it's a temporary solution, one day I will code this feature directly inside the main Go script)

The code is very simple, just standard Go language, no external libraries do download or anything like that, but as it becomes more complex this might change in the future.

## Why?

Because I wanted to have a Single page app that could run on a classic static website hosting service without having to leverage custom configurations.

And also because I needed an excuse to try using Go in a project.

## Using this for yourself

If you want you can try to use this project to build your own website, but I don't suggest you do, a better option would be to use something like Hugo or 11ty.

Anyway, setting up the code building locally is extremely straightforward: 

- Clone this repo, create a config.json file in the repository root with this inside:

```json
{
    "data_path": "path/to/data",
    "build_path": "/path/to/build",
    "web_root": "http://localhost",
    "site_title": "Title",
    "site_title_separator": "|",
    "replace_file_extension": false
}
```

- Build the stylesheets using Sass

```
    $ cd /data/panino.dev
    $ sass sass/:css/
```
- Launch the build with any of these commands:
- 
```
    $ ./build.sh config.json
    $ go run build.go config.json
```


## Contributing

I'm not really looking for help with coding right now, but if you like what I'm making you are welcome to support me through my <a href="https://ko-fi.com/PaninoCode" target="_blank">Ko-fi page</a> or <a href="https://neocities.org/site/paninodev" target="_blank">Neocities profile</a>