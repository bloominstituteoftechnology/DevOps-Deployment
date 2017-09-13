# DevOps and Deployment

## Course Introduction

Software is great and all. But truly nothing matters except delivery. This course is intended to teach you the philosophy of Continuous Deployment. Continuous Deployment refers to automatically making any submitted code available for testing every time a code change is submitted. Many engineers today believe that this method results in more reliable code. In addition to teaching you about Continuous Deployment (or Continuous Integration), this course will also teach you to create a deployment of one of your Lambda School projects using this method.

## What is DevOps?

DevOps is the complicated framework that surrounds transmitting your code from your local machine to the public. The specific steps taken to perform this transmission (aka: deployment) are extremely varied. There are many dozens of web sites dedicated to helping you deploy your code to the internet and collect a small fee from you for this service. Regardless of which service or technology you use, DevOps is always loosely comprised of the following steps:

1. Connecting a computer to a network (usually the internet).
2. Installing and configuring an operating system on that computer.
3. Installing software on that computer that can open a socket and respond to incoming traffic.
4. Customizing the above software to perform a specific business, entertainment, or hobby-related task.
5. Configuring the above software to become failure tolerant (automatically restart).
6. Configuring the above software to be data-consistent.

The above steps are sufficient to take your local software development project to the public. You can trivially hire a service to perform the first 3 steps, leaving you only with the remaining 3. You can ignore steps 5 and 6, leaving them up to the software configured in 2, and you can create static websites that aren't subject to the issues in steps 5 and 6. Geocities, [Wordpress](https://www.wordpress.com), [Small Victories](https://www.smallvictori.es/), and many other sites allow you to implement only step #4. If you wish to be a professional web developer, you will need to learn the rest of the steps.

Finally, the above steps only create a relatively brittle site. In particular, these steps don't help at all with the development process - that is, the process of writing and refining your application code to become reliable, feature-rich, and bug free. These steps in particular do not scale well for projects that are not toys: most development projects involve many developers, technologies being developed in parallel, and thousands or millions of expectant customers waiting for each revision. In order to safely and effectively deliver code to the world at large, more development is needed.

## Continuous Deployment
    
    Any sufficiently advanced Ops is indistinguishable from Dev
    - Baron Schwartz @xaprb -

### Advanced DevOps:

1. Steps 1 and 2 from above can be automated to a degree
2. Write software that loads software from elsewhere
3. Test the software as soon as it is loaded from elsewhere (unit and integration tests)
4. Build/compile/deploy the software to the same computer or another computer
5. Report on test and build results to another computer automatically
6. Monitor the stability of the deployed software
7. Add more software when traffic increases, remove it when it decreases (Load balancing)
8. Hosting servers in different physical locations in order to improve performance and fault tolerance
9. Splitting up data in different locations to improve performance and fault tolerance

### Different servers for different jobs

1. Front end server
2. Database server
3. Authentication server
4. Micro services
5. Integration server

### Version control

Every piece of software is running a specific version. Version numbers actually reference a specific container configuration and a specific git commit version.

### Automatic Deployment

Whenever you push to a specific Git branch, your integration server receives a Git Hook, requesting that the repository be built, tested, and deployed.

### Quality Assurance

# Sprint:

Devops Lecture:

Topics:

- Hosting and network/device security
- Ngrok
- Static hosting
- Shared environment hosting
- Dedicated server hosting
- Front end hosting
- Database hosting
- Cloud hosting
- Microservers
- Web servers(nginx) and simple servers(express)
- Google, AWS, Heroku, Azure, etc
- Containerization
- Automated test
- Automated deployment
- Versioning
- Security in motion (HTTPS)
- Security at rest (ssh, pub/priv key encryption, MFA, password danger, etc)

Assignment:

Let's build a CI pipeline:

You need:
A front end in a repository
Unit tests for your front end
A back end in a repository
Integration tests for your back end

You will:
Follow instructions at GCP for creating a Docker container for your repository
Test your docker container with the command line:
- Is it running? (curl localhost:port)
- Can you stop it (docker command)
- Can you start it again? (docker command)
Create a branch of your back end called `qa`
Deploy your `qa` 





