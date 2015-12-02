Hook3r
===================
A tool that will help to automate your deployments. 

The core concept is that you receive webhooks and use the data (body or query params) and pass it as Environment variables to a script. 

JSON Query is being used in order to specify value.

It is possible to apply transformations to the received data through _ (lodash) functions


Install
====================
Dependencies
	nodemon: Keeps node running at all time.
	bunyan: Logging platform.

npm install -g nodemon bunyan

Usage
=====================
The tool has been developed in a way that in can be installed on standalone mode (npm install -g) or it can be installed as a module. A docker image has been provided as well. 

I want to receive the data from the body and have all query fields and from body parsed and pushed as environment variables for the process to run.

For example:

Script to run: print-body-variable.sh (Check the hooks folder)
Secret: changeme!! (default)
Hashed script name: c0X7svTBlOqkP2TPslstnvGCmsYt5c2d


```
curl -H "Content-Type: application/json" \
-X POST -d '{"name": "hook3r-tst"}' \
http://0.0.0.0:18080/c0X7svTBlOqkP2TPslstnvGCmsYt5c2dc0X7svTBlOqkP2TPslstnvGCmsYt5c2d
```

The output of the script file should be visible on the logs.

DEBUG: default/42997 on local:  (module=hooker)
    Static ENV: A value manually set
    Name: hook3r-tst


Configuration
=============

ENVIRONMENT VARIABLES used
* PWD
* SECRET
* PATH: All this paths are relative to the Hooker path (default ./hooks folder from where the app has been launched)

GLOBAL OPTIONS (on json)
* hooks_path


JSON QUERY
===========
#TODO: Document the usage and the support of lodash functions (cool feature)


STATIC ENVIRONMENT VARIABLES
============================
#TODO: Document how other environment variables can be passed in statically through the hooks.json file


Docker
------
You can find the docker image here. It will run on port 18080


Security
----------
It is absolutely necessary to point that we are not enforcing any type of check on what commands are being executed. That is why it's an absolute must to provide TLS

SSL Certs
hook3r -c ./path/to/ssl/server.crt -k ./path/to/ssl/server.key

File name encryption
hooke3r -s 'nonDefaultSecret' hash name_of_file_to_encrypt.sh



TO DO
-----
- Include query params as possible environment variables.
- Add tests
