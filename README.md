# Facebook-Messenger-JSON-viewer
If you've downloaded your Facebook data in JSON format, this tool lets you read the chats more intuitively.
Useful if you've deleted Facebook, but downloaded your JSON data.

Fork:
Used various AI sites to make the code current, Github Copilot helped the most.
Added:
- inline images
- audio and video rendering
- reactions
- urls converted to clickable links
- timestamp to the right of participant, it's set for EST, edit for your timezone.
- Swapped the original left right bubble participants. I wanted left to be me.
- added day of week hoverover to the timestamps


As raw JSON, it's hard to read and it's in reverse chronological order:
![raw json](img/rawjson.png)

Using this Facebook Messenger JSON viewer, it looks much better:
![viewer](img/viewer.png)

## How to use

Clone this repo and run `chat_display.html` on your browser.

Once you've opened the link or cloned the repo and opened the HTML file, you will need to choose your JSON file that you want to parse using the file selector.

After selecting your file, you'll be asked which participant you are. This will put your messages on blue bubbles on the right side, and everyone else's messages on the left, in grey bubbles.

Voilà, your chats can now be easily read.

## Ideas / TODO
* Add a slider or calendar picker to filter dates in the chat (not supported by Facebook Messenger unless you want to spend hours scrolling and loading).
