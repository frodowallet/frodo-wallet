# Frodo Wallet - Run as offline website

## Steps for running

0. Install Python. If you are on Linux or maxOS, it should already be installed.
   If you are on Windows, you can go to [python.org](https://python.org) and follow these steps (Source: [mdn web docs](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/set_up_a_local_testing_server)):

   * Click the link for Python "3.xxx" (latest version).
   * Go the bottom of the page and click the _Windows Installer_ link to download the installer.
   * Once downloaded, run the installer.
   * On the first installer page, check the "Add Python 3.xxx to PATH" checkbox.
   * Click _Install_, and close the installer once it finishes.

1. After unzipping Frodo Wallet get the full path of the unzipped folder (i.e. the one containing this file),
   for example by right clicking on the directory to check its properties. The full may look like this
   on Windows `C:\Documents\frodowallet`. Copy this path to the clipboard.
2. Open your command prompt (Windows) / terminal (macOS/ Linux). In the following command make sure you replace
   the previously obtained full path for the full path shown here at the end of the command.
   Type this command into your command prompt / terminal and press enter to start up the server.

```
python -m http.server --directory C:\Documents\frodowallet
```

3. You should now be able to access Frodo Wallet by open [http://localhost:8000](http://localhost:8000) in your web browser.