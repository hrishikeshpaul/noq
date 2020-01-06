# [No Q](https://noq-client.herokuapp.com/)

No Q, is a revolutionary tool which allows for both employers and students to skip the hassle seen in modern day career fairs. For the students, we have an intuitive profile builder where you can add things like education, skills, certifications, honors, and experiences. These all culminate into a sleek home page where you will see all the positions in which your skills meet the criteria! If you are curious about the most in-demand skills, you can use our “What-if” feature where you can manually input skills to see the positions which require them. On top of that, we offer a variety of different ways to filter the posted positions; including location, skills, job title, and more. Applying is easier than ever before, as all the student needs to do is click on the position card and click on the green arrow, automatically applying them from the position and remove it from their home page. No Q is not only good for students, but employers as well! A common problem at modern career fairs is the number of unqualified candidates who waste their time when they could be chatting with someone else. With No Q, only the students who meet the positions’ criteria will be able to apply, and from there the recruiter can invite them to talk in more detail at the career fair through our intuitive messaging system. The employer also has an easy to manage list of all applicants, making it very easy to see their most important features, such as experience and the technical skills they possess.

## Dependencies

I have listed down the libraries you need to have installed on your system before you can start.
1. npm
2. mongodb (optional)


## How to run the client

1. `git clone https://github.com/hrishikeshpaul/noq.git`
2. `cd noq`
3. Make sure your mongodb service is running in the background
4. `npm install`
5. `npm run dev`

## How to run the server

1. `git clone https://github.com/hrishikeshpaul/noq-server.git'`
2. `cd noq-server`
3. `npm install`
4. `npm start`

## Git Workflow

So since there are 4 people working on this, we kinda need to work in an organized way. So i've listed a sample git workflow that we could follow in order to get started.

1. **No pushes to master**. The master branch will only be updated
at the end of a spring once testing is done.

2. **No direct pushes to develop**. This is the branch that should
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
