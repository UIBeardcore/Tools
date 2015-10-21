UIBeardcore Tools | TopologyManagerClient
================================================
	
## Version
This extension is intended for SDL Web 8. It was not tested in previous versions

This extension is **not yet finished** and was not tested in any browsers except Chrome and a bit of FF.

## Description
This extension allows you to see how css transitions works, and all the other funny stuff (in fact it is a topology manager client for those UI monkeys who does not want to deal with powershell console)

## Installation

1. Do build solutions (Editor and Model)

2. Look at `\UIBeardcore.Tools.TopologyManagerClient.Editor\Configuration\add_to_cme.ps1` and run it 

3. Look at `\UIBeardcore.Tools.TopologyManagerClient.Models\Configuration\add_to_cme.ps1` and run it 

4. Open `%TRIDION_HOME%\web\WebUI\WebRoot\Configuration\System.config` file

5. Locate `\Configuration\servicemodel\server` node in System.config file and increase the value of its `modification` attribute to notify client browsers to update their cache

## Disclaimer
This extensions intended to show you extensibility mechanisms you can find useful in your further development. It does not have intention to provide complete functionality as a final product. However, if you feel this might be interesting and useful, do not hesitate to commit to this project. 