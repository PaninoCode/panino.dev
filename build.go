/*
	build.go
	Author: Alex Niccolò Ferrari @paninoCode

	Build script configurable for my personal website: panino.dev / panino.fun
*/

package main

import (
	"crypto/rand"
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type PageStructure struct {
	ModuleId  string `json:"id"`
	Animation string `json:"animation"` // ignored for now.. should not be string
}

/*
	#################### REDIRECTS ####################
*/

// //go:embed data/config/redirects.json
// var redirectsJson string

type Redirect struct {
	Path   string `json:"path"`
	Target string `json:"target"`
}

var redirects []Redirect

/*
	#################### ERROR PAGES ####################
*/

// //go:embed data/config/errorPages.json
// var errorPagesJson string

type ErrorPage struct {
	Id        string          `json:"id"`
	ErrorCode string          `json:"error_code"`
	Structure []PageStructure `json:"structure"`
	Title     string          `json:"title"`
	Type      string          `json:"type"` //currently not used
	Auth      string          `json:"auth"` //currently not used
}

var errorPages []ErrorPage

/*
	#################### MODULES ####################
*/

// //go:embed data/config/modules.json
// var modulesJson string

type Module struct {
	Id      string   `json:"id"`
	Src     string   `json:"src"`
	Type    string   `json:"type"`
	Scripts []string `json:"scripts"`
}

var modules []Module

/*
	#################### ROUTES ####################
*/

// //go:embed data/config/routes.json
// var routesJson string

type Route struct {
	Id        string          `json:"id"`
	Path      string          `json:"path"`
	Aliases   []string        `json:"aliases"`
	Structure []PageStructure `json:"structure"`
	Title     string          `json:"title"`
	Type      string          `json:"type"` //currently not used
	Auth      string          `json:"auth"` //currently not used
}

var routes []Route

/*
	#################### EXPORTED PAGE ####################
*/

type ExportedPage struct {
	Title   string   `json:"title"`
	Html    string   `json:"html"`
	Scripts []string `json:"scripts"`
}

/*
	#################### LOCALES ####################
*/

// //go:embed data/config/locales.json
// var localesJson string

type Locale struct {
	Id   string `json:"id"`
	Path string `json:"path"`
}

var locales []Locale

/*
	#################### STATIC MODULES ####################
*/

var headerHtml string
var sidebarHtml string
var footerHtml string
var baseHtml string

/*
	#################### CONFIG ####################
*/

// //go:embed config.json
// var configJson string

type Config struct {
	DataPath             string `json:"data_path"`
	BuildPath            string `json:"build_path"`
	WebRoot              string `json:"web_root"`
	SiteTitle            string `json:"site_title"`
	SiteTitleSeparator   string `json:"site_title_separator"`
	ReplaceFileExtension bool   `json:"replace_file_extension"`
}

var config Config

var reset = "\033[0m"

// var bold = "\033[1m"
// var underline = "\033[4m"
// var strike = "\033[9m"
// var italic = "\033[3m"

var cRed = "\033[31m"
var cGreen = "\033[32m"
var cYellow = "\033[33m"
var cBlue = "\033[34m"

// var cPurple = "\033[35m"
// var cCyan = "\033[36m"
// var cWhite = "\033[37m"

func printInfo(msg string) string {
	return cBlue + msg + reset
}

func printSuccess(msg string) string {
	return cGreen + msg + reset
}

func printWarning(msg string) string {
	return cYellow + msg + reset
}

func printError(msg string) string {
	return cRed + msg + reset
}

// Generate build UUID
var buildUUID = gen_id()

// Generate build time and date
var buildTime = time.Now().Format(time.RFC850)

func main() {

	//	Manage no args. case
	if len(os.Args) != 2 {
		fmt.Println(printError("Missing argument: Config file."))
		return
	}

	json.Unmarshal([]byte(ReadFile(os.Args[1])), &config)

	// Decode all the Json files
	json.Unmarshal([]byte(ReadFile(path.Join(config.DataPath, "/config/redirects.json"))), &redirects)
	json.Unmarshal([]byte(ReadFile(path.Join(config.DataPath, "/config/errorPages.json"))), &errorPages)
	json.Unmarshal([]byte(ReadFile(path.Join(config.DataPath, "/config/modules.json"))), &modules)
	json.Unmarshal([]byte(ReadFile(path.Join(config.DataPath, "/config/routes.json"))), &routes)
	json.Unmarshal([]byte(ReadFile(path.Join(config.DataPath, "/config/locales.json"))), &locales)

	// Static Modules
	headerHtml = ReadFile(path.Join(config.DataPath, "/modules/static/header.html"))
	sidebarHtml = ReadFile(path.Join(config.DataPath, "/modules/static/sidebar.html"))
	footerHtml = ReadFile(path.Join(config.DataPath, "/modules/static/footer.html"))
	baseHtml = ReadFile(path.Join(config.DataPath, "/base.html"))

	fmt.Println(printInfo("\nBuilding " + config.SiteTitle + " inside " + config.BuildPath))

	// Remove old directory
	os.RemoveAll(config.BuildPath)

	// Try and create directory
	os.Mkdir(config.BuildPath, os.ModePerm)

	// Directory check
	var directoryCheck = "Directory: [" + config.BuildPath + "]"
	if _, err := os.Stat(config.BuildPath); !os.IsNotExist(err) {
		// Directory is valid, we can proceed
		fmt.Println(printSuccess(directoryCheck + " is Valid."))
	} else {
		// Directory is not valid, cancel build
		fmt.Println(printError(directoryCheck + " is NOT Valid!\nCancelling build."))
		return
	}

	for _, locale := range locales {
		fmt.Println(printInfo("\nUsing locale: [" + locale.Id + "] with path: [" + locale.Path + "]"))

		// Generate Pages
		for _, route := range routes {

			switch route.Type {
			case "normal":
				GeneratePage(route, locale)
			case "ignore":
				fmt.Println(printWarning("Page: [" + route.Id + "] is set to be ignored"))
			}
		}
	}

	// Create redirects
	for _, redirect := range redirects {

		fmt.Println(printInfo("Creating redirect in: [" + redirect.Path + "] targeting: [" + redirect.Target + "]"))

		var redirectHtml = "<script>window.location.replace(\"" + redirect.Target + "\");</script><p>You are being redirected, if you still see this page after a white <a href=\"" + redirect.Target + "\">click here</a>.</p>"

		CreateFile(path.Join(config.BuildPath, strings.TrimPrefix(redirect.Path, "/")+".html"), redirectHtml)

	}

	// Copy static folders
	var foldersToCopy = []string{"css", "images", "scripts"}

	for _, folderToCopy := range foldersToCopy {

		var sourceFolder = path.Join(config.DataPath, folderToCopy+"/")
		var destinationFolder = path.Join(config.BuildPath, folderToCopy+"/")

		fmt.Println(printInfo("Copying folder: [" + sourceFolder + "] into path: [" + destinationFolder + "]"))

		err := CopyDir(destinationFolder, sourceFolder)
		if err != nil {
			fmt.Println(printError("Error copying folder [" + sourceFolder + "] \n\t\t" + err.Error()))
		} else {
			fmt.Println(printSuccess("Folder [" + sourceFolder + "] copied successfully"))
		}
	}

	// add a line break at the end, to make the console output look nicer
	fmt.Print("\n")

}

func GeneratePage(route Route, locale Locale) {

	var localePath = locale.Path
	var localeFolder = strings.Replace(localePath, "/", "", -1)

	if localeFolder != "" {
		os.Mkdir(path.Join(config.BuildPath, localeFolder), os.ModePerm)
	}

	fmt.Println(printInfo("Generating page: [" + route.Id + "] With path: \"" + route.Path + "\""))

	var pageHtml string = baseHtml
	var mainScripts []string
	var mainHtml string

	var oldStrings = []string{"<?gen PAGE-LANG ?>", "<?gen PAGE-REPLACE-EXTENSION ?>", "<?gen PAGE-TITLE ?>", "<?gen PAGE-HEADER ?>", "<?gen PAGE-SIDEBAR ?>", "<?gen PAGE-MAIN ?>", "<?gen PAGE-FOOTER ?>", "<?gen BUILD-ID ?>", "<?gen BUILD-TIME ?>"}

	for _, oldString := range oldStrings {
		var newString string
		switch oldString {
		case "<?gen PAGE-LANG ?>":
			newString = localeFolder
		case "<?gen PAGE-REPLACE-EXTENSION ?>":
			newString = strconv.FormatBool(config.ReplaceFileExtension)
		case "<?gen PAGE-TITLE ?>":
			newString = route.Title + " " + config.SiteTitleSeparator + " " + config.SiteTitle
		case "<?gen PAGE-HEADER ?>":
			newString = headerHtml
		case "<?gen PAGE-SIDEBAR ?>":
			newString = sidebarHtml
		case "<?gen PAGE-MAIN ?>":
			for _, routeModule := range route.Structure {
				var moduleHtml string
				var moduleJs string
				for _, module := range modules {
					if module.Id == routeModule.ModuleId {
						// open the module file

						var moduleSrc = path.Join(config.DataPath, "/modules/", module.Src)

						moduleHtml = ReadFile(moduleSrc)

						for _, script := range module.Scripts {

							moduleJs += "<script src=\"" + script + "?bId=" + buildUUID + "\" type=\"text/javascript\"></script>"
							mainScripts = append(mainScripts, script)

						}
					}
				}
				newString += moduleHtml + moduleJs
				mainHtml += moduleHtml
			}
		case "<?gen PAGE-FOOTER ?>":
			newString = footerHtml
		case "<?gen BUILD-ID ?>":
			newString = buildUUID
		case "<?gen BUILD-TIME ?>":
			newString = buildTime
		}

		pageHtml = strings.Replace(pageHtml, oldString, newString, -1)
	}

	// Write file to build folder

	var newFileName string

	if route.Path == "/" {
		//case for website index
		newFileName = "index"
	} else {
		newFileName = strings.TrimPrefix(route.Path, "/")
	}

	var pageRouteObj ExportedPage

	pageRouteObj.Html = strings.Replace(mainHtml, "<?gen WEB-ROOT ?>", config.WebRoot+localePath, -1)
	pageRouteObj.Title = route.Title + " " + config.SiteTitleSeparator + " " + config.SiteTitle
	pageRouteObj.Scripts = mainScripts

	for index, script := range pageRouteObj.Scripts {
		pageRouteObj.Scripts[index] = script + "?bId=" + buildUUID
	}

	pageRouteJson, err := json.Marshal(pageRouteObj)
	if err != nil {
		panic(err)
	}

	pageHtml = strings.Replace(pageHtml, "<?gen WEB-ROOT ?>", config.WebRoot+localePath, -1)

	CreateFile(path.Join(config.BuildPath, localeFolder, newFileName+".html"), pageHtml)
	//CreateFile(path.Join(config.BuildPath, newFileName+".content.txt"), mainHtml)
	CreateFile(path.Join(config.BuildPath, localeFolder, newFileName+".json"), string(pageRouteJson))

	// Write aliases

	if route.Aliases != nil {
		for _, alias := range route.Aliases {
			fmt.Println(printInfo("Generating Alias: [" + alias + "]"))

			CreateFile(path.Join(config.BuildPath, localeFolder, strings.TrimPrefix(alias, "/")+".html"), pageHtml)
			//CreateFile(path.Join(config.BuildPath, strings.TrimPrefix(alias, "/")+".content."), mainHtml)
			CreateFile(path.Join(config.BuildPath, localeFolder, strings.TrimPrefix(alias, "/")+".json"), string(pageRouteJson))

		}
	}

}

func CreateFile(filePath string, fileContents string) {
	fmt.Println(printInfo("Writing file: [" + filePath + "] into filesystem"))

	err := os.WriteFile(filePath, []byte(fileContents), 0644)
	if err != nil {
		fmt.Println(printError("Error writing file [" + filePath + "] \n\t\t" + err.Error()))
	} else {
		fmt.Println(printSuccess("File [" + filePath + "] created successfully"))
	}
}

func ReadFile(filePath string) string {
	fmt.Println(printInfo("Reading file: [" + filePath + "]"))

	fileData, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Println(printError("Error reading file [" + filePath + "] \n\t\t" + err.Error()))
		return ""
	} else {
		return string(fileData)
	}
}

// CopyDir copies the content of sourceFolder to destinationFolder. sourceFolder should be a full path.
func CopyDir(destinationFolder, sourceFolder string) error {

	return filepath.Walk(sourceFolder, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// copy to this path
		outpath := filepath.Join(destinationFolder, strings.TrimPrefix(path, sourceFolder))

		if info.IsDir() {
			os.MkdirAll(outpath, info.Mode())
			return nil // means recursive
		}

		// handle irregular files
		if !info.Mode().IsRegular() {
			switch info.Mode().Type() & os.ModeType {
			case os.ModeSymlink:
				link, err := os.Readlink(path)
				if err != nil {
					return err
				}
				return os.Symlink(link, outpath)
			}
			return nil
		}

		// copy contents of regular file efficiently

		// open input
		in, err := os.Open(path)
		if err != nil {
			return err
		}
		defer in.Close()

		// create output
		fh, err := os.Create(outpath)
		if err != nil {
			return err
		}
		defer fh.Close()

		// make it the same
		fh.Chmod(info.Mode())

		// copy content
		_, err = io.Copy(fh, in)
		return err
	})
}

func gen_id() (uuid string) {

	b := make([]byte, 4)
	_, err := rand.Read(b)
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	uuid = fmt.Sprintf("%X", b[0:])

	return
}
