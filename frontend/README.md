### Using frontend with different api path than localhost:

The way that I set this up to work is that in the apiroutes.js file, it first checks the environment variable REACT_APP_API_HOST for a value, if there is not one then it defaults the path to 'localhost'.

In order to specify the host:
1. Set env variable on the command line (where host_name is the desired host)
    ways to do so:
    - export REACT_APP_API_HOST=host_name
    - REACT_APP_API_HOST=host_name
    - windows idk
2. (optional) check that the variable is set
    printenv REACT_APP_API_HOST
3. Run desired npm script (ie npm run build, npm run host) and it should use the specified value in the variable

If no variable is set then it defaults to localhost.
