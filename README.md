How to use the hooker
===================

All begins with a problem... we were needing to auto deploy when master build passes. As we use Gitflow for our dev process.

We deploy our services with docker. At the moment just plain, but we are in an evaluation process for migrating to Kubernetes. 

For the time being we still need to solve the problem of detecting hooks. And is so complicated to just have a good tool that puts security on top and gives you a lot of freedom. 

Want to know more? follow through... 

I want to receive the data from the body and have all query fields and from body parsed and pushed as environment variables for the process to run.

```
https://appdomain.com/script_name_to_run
```

script_name_to_run has to be a valid name. 
	***
	***

A script will receive all those parse properties as environment variables for you to use within the 


How to run it embedded on your server?
--------------------------------------

ENVIRONMENT VARIABLES used
* PWD
* HOOKER_SECRET

GLOBAL OPTIONS (on json)
* hooks_path
*


TO ADD
* Interface listener
* Port
* SSL Certificates
* Algorithm




Security
----------
It is absolutely necessary to point that we are not enforcing any type of check on what commands are being executed. That is why it's an absolute must to provide TLS and an access token. 

TO DO
-----

- Is hashing the best way to encode the file name?
- Include query params as possible environment variables.
- SSL support
- Add more tests
- Make hooker config to be dynamic. No need to restart if modified.
