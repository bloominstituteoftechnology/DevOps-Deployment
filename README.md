# DevOps and Deployment

## Objective
The main objective of this lab is to expose you to concepts relating to dev ops and deployment. You'll be walked through 
the steps needed in order to deploy an application you've built to Google Cloud Platform, but it's important to understand 
that this particular set of steps has only been tested to work on a particular environment (namely, the environment of the 
instructor who authored this repository). So, it is definitely possible that you will run into issues related to your own 
environment that were not anticipated by the repository author. If that happens to you, do your best to debug the issue 
with the help of instructors, but don't worry if you end up not finishing the lab as a result. There are _lots_ of moving 
parts to creating a deployment pipeline, and it's a lot of work that typically requires the full-time attention of multiple 
dev ops engineers and a lot more time than just two days. We just want to expose you guys to these concepts, not because 
we're preparing you guys for dev ops jobs coming out of Lambda, but because it is good to have an idea of how the process 
of creating a deployment pipeline is done. 

-----

Now that you've created a Docker image or two, it's time to build out an entire deployment pipeline. Like the Docker mini 
lab, this one will mostly be going following instructions as well, since there are many parts to establishing a deployment 
pipeline.

The overall high-level steps we'll be going through are:
 - Creating an account on Google Cloud Platform
 - Getting the GCP SDK up and running locally
 - Creating a GCP project
 - Building and running a Docker image of the included backend and frontend repos
 - Creating a deployment specification file
 - Creating a Kubernetes cluster to deploy our Docker images
 - Exposing our newly-deployed service to the internet
 - Scaling up the service
 - Cleaning up

## Creating an Account on GCP
To create an account on GCP, sign in to the GCP console at [https://console.cloud.google.com/](https://console.cloud.google.com/). 
If you're a first-time user of GCP, you'll be give $300 in credit for you to use. This is important since each project you create 
on GCP will require billing information, which you will need to enter, but it's nice that you are provided a cushion. 

## Getting the GCP SDK Up and Running Locally
While a lot of these steps can be done from inside the online GCP console, it's preferable that you install the Google Cloud 
SDK locally. Visit [this link](https://cloud.google.com/sdk/) in order to download the SDK for your platform. Once the download 
completes, unzip the archive and run the installation script with `./google-cloud-sdk/install.sh`. Once that completes, make 
sure the `gcloud` command is accessible from your command line. If it isn't, you'll most likely need to source it in your 
bash profile with `source [PATH_TO_GOOGLE_CLOUD_SDK/google-cloud-sdk/path.bash.inc`. This is contingent on you using bash 
as your default shell, and are on a Mac or Linux machine. If you're using zsh as your default shell, there's a separate 
`path.zsh.inc` file that you'll want to source instead inside of your `.zshrc`. If you're on a Windows, you'll have to 
figure that out on your own if the `gcloud` command` isn't working for you. There's a Windows quick start guide you can 
find [here](https://cloud.google.com/sdk/docs/quickstart-windows) and an installion guide [here](https://cloud.google.com/sdk/downloads) 
that will hopefully help. 

Once you've determined that the `gcloud` command is accessible from your command line, type `gcloud init` and follow the instructions 
to configure your gcloud environment. Once that completes, type in 
```
$ gcloud components install kubectl
```
to install the Kubernetes command line interface for running commands against Kubernetes clusters.

## Creating a GCP Project
Now it's time to create a GCP project that we'll want to deploy. You'll want to create one from the [web UI](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project).
Name it something where you will be able to differentiate between the backend repository and the frontend repository, since we 
will need to create separate projects for them via the GCP web UI console. Once you've created the project and taken note of 
the project ID, you'll want to export the project ID to an environment variable so that it will be aliased for you by typing  
```
$ export PROJECT_ID="YOUR_PROJECT_ID"    # The double quotes are necessary in this case
```

## Building and Running a Docker Image
This step should hopefully be somwhat familiar to you by now. We'll first be creating a Docker image of the backend repository 
inside the `/backend` directory. Your Dockerfile should look like this:
```
FROM node:8.7
COPY package.json package-lock.json ./
WORKDIR /
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

Now we'll build the Docker image with 
```
$ docker build -t gcr.io/${PROJECT_ID}/lambda-backend-devops:v1 .
```
Here, `v1` is the tag of the image, and our iamge name needs to be prefaced with `gcr.io` since we'll be deploying it to 
Google's Container Registry. 

Run the Docker image you just built with 
```
$ docker run -d -p 8080:8080 gcr.io/${PROJECT_ID}/lambda-backend-devops:v1
```
Now you can `curl localhost:8080` to ensure that the backend container is up and running. 



## Initializing a Kubernetes Cluster
In order to initialize a brand new Kubernetes cluster, run 
```
$ gcloud container clusters create [CLUSTER NAME HERE] \
      --num-nodes=2 \
      --zone=[ZONE YOU'RE LOCATED IN] \
      --machine-type n1-standard-1 \
      --project=${PROJECT_ID}
```

The list of GCP regions and zones can be found [here](https://cloud.google.com/compute/docs/regions-zones/). Pick the zone that is 
geographically closest to you. 

Now you'll need to connect your `kubectl` client to your cluster by running
``` 
$ gcloud container clusters get-credentials [CLUSTER NAME HERE] --zone=[YOUR ZONE HERE]
```
So now we have a docker image and a cluster. We want to deploy that image to our cluster and start the containers so that 
requests to them can be served. 

## Upload Docker Image to Google Container Registry
We need to push our built Docker image to the container registry now with
```
$ gcloud docker -- push grc.io/${PROJECT_ID}/lambda-backend-devops:v1
```
If you receive a message saying that your access to the Google Container Registry API was denied, visit the URL that the error 
message displays in order to enable API access, then re-run the command again. 

## Creating a Deployment Specification File 
Now it's time to prepare for deployment. The first thing we'll need to do is create a `deployment.yml` file. It'll look like 
this:
```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: [YOUR PROJECT ID HERE] # You'll need to manually type this out. The environment variable won't work
spec:
  replicas: 2
  template:
    metadata:
      labels: # labels to select/identify the deployment
        app: [YOUR PROJECT ID HERE]
    spec:     # pod spec                  
      containers: 
      - name: [YOUR PROJECT ID HERE] 
        image: gcr.io/[YOUR PROJECT ID HERE]/lambda-backend-devops:v1  # image we pushed
        ports:
        - containerPort: 8080
```
This file specifies the creation of two pods where each pod is defined by the given pod spec. Each pod should have a container 
containing our `lambda-backend-devops:v1` Docker image that we pushed. 

## Creating a Cluster to Deploy our Docker Images
After setting up our deployment specification file, we can run 
```
$ kubectl create -f deployment.yml --save-config
```

If that completed successfully, you'll then be able to see your deployment status by running `kubectl get deployments`. To 
view the pod created by your deployment, run `kubectl get pods` to get a list of the running pods. Note that there are two 
pods running because we specified that 2 replicas be created in our deployment specification.

To make sure the server started, you can check its logs by running `kubectl logs {POD NAME}`. This will print out the name 
of your deployment if it was deployed successfully. 

## Expose your Service to the Internet
In order to expose our deployed software to the internet, we need to place our containers behind a load balancer. In order 
to do that, we need to create a new Kubernetes service. We can do so with the following command:
```
$ kubectl expose deployment [NAME OF YOUR DEPLOYMENT] --type="LoadBalancer"
```

This will instantiate a Kubernetes service that handles a Google Cloud load balancer to manage traffic to your deployed 
containers. 

Now, run `kubectl get services` to get the public IP address of your service. With that, you can visit `http://[PUBLIC IP]:[PORT]` 
in order to access your newly-deployed service! From here, you would purchase a domain name from a domain supplier to point to 
this IP and port number. 

## Scaling Your Service
You can easily scale the number of replicas by changing the `replicas` field in your `deployment.yml` file. After editing the file, 
run `kubectl apply -f deployment.yml` to apply the changes. While we mentioned autoscaling in the lecture, it is non-trivial to setup. 
If you're curious, [here](https://cloud.google.com/compute/docs/autoscaler/) are some docs on how autoscaling can be achieved. 

## Cleaning Up
At the end of all this, unless you want these deployed projects to eat away at your GCP credit, you'll need to go clean them up.
```
# Delete the Kubernetes load balancer service 
$ kubectl delete service/[NAME OF YOUR DEPLOYMENT]

# Delete the Kubernetes deployment itself
$ kubectl delete deployment/[NAME OF YOUR DEPLOYMENT]

# Delete your GCP cluster
$ gcloud container clusters delete [YOUR CLUSTER NAME] --zone=[YOUR ZONE]
```

## In Summary
We've gone and deployed a single node.js application using GCP, Docker, and Kubernetes. As was mentioned in the lecture, all of the 
different pieces of your source code will all need to be deployed in the same way. Now, follow the same flow to deploy the included 
frontend repository to GCP. It won't be exactly the same of course, names will have to be changed and the like, but the overall flow 
should be pretty similar. If you get through that, don't forget to clean up all the services, clusters, and deployments you created!
