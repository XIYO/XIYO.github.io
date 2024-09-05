# ENABLE FORCE PUSH ON INTELLIJ

By default, force push is protected on the master and main branches in IntelliJ. \
Let's explore how to resolve this.

## SCENARIO

To automate deployment using GitHub Actions, I encountered several syntax errors. \
As a result, messy test code was left in the commit log, and I needed to enable force push to clean it up.

## SOLUTION

![open search everywhere](img.png)  
![modify protected branch](img_1.png)

- Step 0: Press the shortcut keys <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd> to open the `Search Everywhere` window.  
- Step 1: In the `Search Everywhere` window, type "Protected branches:" and click on the matching item.  
- Step 2: In the `settings` window, locate the `Protected branches:` field and delete its contents.

## TROUBLESHOOTING

Since GitHub and GitLab have branch protection features, you need to check the settings of each repository.

