UIBeardcore Tools | Rename
================================================
	
## Version
This extension is intended for SDL Tridion 2013 SP1. It was not tested in previous versions

## Description
This extension allows you to do multiple items rename in CME

## Installation

1. Take a look at `$/Rename/UIBeardcore.Tools.Rename.Editor/Configuration/System.config.sample.xml` and [configure editor extension](http://tridion.uibeardcore.com/2013/04/editor-extension/ "Extensibility | Creating Editor Extension")

2. Take a look at `$/Rename/UIBeardcore.Tools.Rename.Model/Configuration/System.config.sample.xml` and configure model extension (similar to Editor, but `Model` folder in IIS, and `models` section in System.config)

3. Configure `UIBeardcore.Tools.Rename.Batching`:

    * Download project;
    * Build it;
    * Register batchInvoker in `%TRIDION_HOME%\config\Tridion.ContentManager.config` adding following section in configuration/batching/batchInvokers

4. Open `%TRIDION_HOME%\web\WebUI\WebRoot\Configuration\System.config` file

5. Locate `\Configuration\servicemodel\server` node in System.config file and increase the value of its `modification` attribute to notify client browsers to update their cache

## Disclaimer
This extensions intended to show you extensibility mechanisms you can find useful in your further development. It does not have intention to provide complete functionality as a final product. However, if you feel this might be interesting and useful, do not hesitate to commit to this project. 