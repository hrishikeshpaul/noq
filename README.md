## Documents
[Weekly Status Report 1](./documents/WeeklyStatusReport1.html)<br>

## Meeting Minutes
[Meeting_Week3_theme](./Meetings/week3_theme.md)<br>
[Customer Meeting 1](./Meetings/CustomerMeeting1.html)<br>

# Job Portal Setup

Okay, so this is a basic guide as to how to run everything and some additional notes.

## Dependencies

I have listed down the libraries you need to have installed on your system before you can start.
1. npm
2. mongodb
3. vuejs

## How to run

1. `git clone https://github.com/RayZhang001/P565_team8.git`
2. `cd P565_team8/job-portal`
3. Make sure your mongodb service is running in the background

Then open 2 terminals/Git-bashes or whatever you guys use,

##### For Server (on one terminal)
2. `npm install`
3. `npm start`

##### For Server (on the other terminal)
1. `cd P565_team8/job-portal`
2. `nodemon ./bin/www` 
4. Navigate to `https://noq-client.herokuapp.com` and you should see the login page

So with these, you will have basic it running. If you have any questions or
if anything isn't working please let me know.

## Git Workflow

So since there are 4 people working on this, we kinda need to work in 
an organized way. So i've listed a sample git workflow that we could 
follow in order to get started.

1. **No one should push to master**. The master branch will only be updated 
at the end of a spring once testing is done.

2. **No one should directly push to develop**. This is the branch that should
have the new/fixed features, before it can be merged to master. 

3. **All your working branches should be branched from develop**. Everytime
you work on a new feature or a fix, you will have to branch out from develop
because that will contain the most recent update.

4. **Create a PULL REQUEST after you push.** This way all of us can review 
the code you have written, and then finalize it to merge it with develop.
Please write appropriate pull request descriptions (2-3 sentences) so as to 
give an idea of what you're requesting for.


## Appropriate Naming

Here are some important notes that can possibly make our lives easier.

So there 3 activities that developers usually do when they're developing,

1. feat - new feature
2. fix - bug fixing
3. chore - enhancements to a feature

With these in mind, we should follow some naming conventions which will definitely
be helpful.

1. **Give appropriate names to your branches**. For example, if you're 
implementing the login feature, your branches should be named,
    1. Front End: `fr-feat/login`
    2. Back End: `br-feat/login`

2. **Use good commit messages.** Below I have stated as to how you can modularize
your commits. This can later help during debugging. If you're developing the login
feature on the front-end,
    1. **Bad Example:** `git commit -m 'login feature added'`
    2. **Good Example:** 
        1. `git commit`. This should open your terminal editor in which you can type 
        your message.
        2. `chore: login route for users added`
        3. If it's a huge commit, then press enter and write a message.
        4. Exit the editor
        




