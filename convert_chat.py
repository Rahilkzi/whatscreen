
import json
import re
from datetime import datetime

def convert_chat_to_json():
    try:
        with open('chat.txt', 'r', encoding='utf-8') as file:
            content = file.read()
            
        message_regex = r'(\d{2}/\d{2}/\d{2}), (\d{2}:\d{2} [AP]M)\s*-\s*(.*?):\s*(.*)$'
        messages = []
        
        for match in re.finditer(message_regex, content, re.MULTILINE):
            date, time, sender, message = match.groups()
            messages.append({
                'date': date,
                'time': time,
                'sender': sender.strip(),
                'message': message.strip()
            })
        
        with open('chat.json', 'w', encoding='utf-8') as json_file:
            json.dump(messages, json_file, indent=2, ensure_ascii=False)
            
        print(f"Conversion complete! {len(messages)} messages exported to chat.json")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    convert_chat_to_json()
