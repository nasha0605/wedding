document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Check URL parameters for business mode and friends mode
    const urlParams = new URLSearchParams(window.location.search);
    const isBusinessMode = urlParams.get('business') === 'true';
    const isFriendsMode = urlParams.get('friends') === 'true';
    
    // Hide sections if in business mode
    if (isBusinessMode) {
        // Hide timeline section
        const timelineSection = document.querySelector('.timeline-section');
        if (timelineSection) {
            timelineSection.style.display = 'none';
        }
        
        // Hide contact cards but keep the section title
        const contactContainer = document.querySelector('.contact-container');
        if (contactContainer) {
            contactContainer.style.display = 'none';
        }
    }

    // Handle friends-only timeline items
    if (!isFriendsMode) {
        document.querySelectorAll('.friends-only').forEach(element => {
            element.style.display = 'none';
        });
    }

    const navigateButton = document.getElementById('navigate-button');
    const calendarButton = document.getElementById('calendar-button');
    const brideName = document.querySelector('.couple-names').textContent.split(' & ')[0];
    const groomName = document.querySelector('.couple-names').textContent.split(' & ')[1];

    // Event details
    const events = [
        {
            title: 'Reception',
            date: '20250504',
            time: '113000',
            endTime: '220000',
            location: 'JMA Convention Center, Choolai, Chennai',
            mapLink: 'https://maps.app.goo.gl/ZUi1joTRvd1LtaNbA'
        }
    ];
    if (!isBusinessMode) {
        events.push({
            title: 'Baraat, Wedding Ceremony',
            date: '20250506',
            time: '103000',
            endTime: '140000',
            location: 'Rani Meyammai Hall, Chennai',
            mapLink: 'https://maps.app.goo.gl/mUmMpYtWN6oBhRGq6'
        });
    }
    if (isFriendsMode) {
        events.push({
            title: 'Batteesi',
            date: '20250501',
            time: '110000',
            endTime: '130000',
            location: 'Adinath Jain Seva Kendra, Choolai, Chennai',
            mapLink: 'https://maps.app.goo.gl/XUn9B84qAySmZvh37' // Replace with actual map link
        });
        events.push({
            title: 'Mayra & Nikasi',
            date: '20250505',
            time: '110000',
            endTime: '140000',
            location: 'Prince Paradise, Vepery, Choolai, Chennai',
            mapLink: 'https://maps.app.goo.gl/DfQhvBTPzp1oqUha9'
        });
        events.push({
            title: 'DJ Party',
            date: '20250502',
            time: '190000',
            endTime: '220000',
            location: 'Shree Hall',
            mapLink: 'https://maps.app.goo.gl/cbHuYaz9h43WGG8y6'
        });
        events.push({
            title: 'Mehendi',
            date: '20250503',
            time: '103000',
            endTime: '120000',
            location: 'Prince Paradise, Vepery, Choolai, Chennai',
            mapLink: 'https://maps.app.goo.gl/DfQhvBTPzp1oqUha9'
        });
    }

    // Add click handlers for all venue links
    document.querySelectorAll('.venue-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.href, '_blank');
        });
    });

    // Add click handler for navigate button
    navigateButton.addEventListener('click', function() {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const latitude = 13.0837;
        const longitude = 80.2700;
        const label = 'JMA Convention Center, Choolai, Chennai';

        let mapUrl;
        if (isAndroid) {
            let mapUri = "geo:" + latitude + "," + longitude;
            if (label) {
                mapUri += "(" + label + ")";
            }
            window.open(mapUri, '_system'); // '_system' will open the native app
        } else if (isIOS) {
            window.open(`maps://?ll=${latitude},${longitude}`, "_system");
        } else {
            mapUrl = 'https://maps.app.goo.gl/ZUi1joTRvd1LtaNbA';
            window.open(mapUrl, '_blank');
        }
        
    });

    calendarButton.addEventListener('click', function() {
        const calendarEvents = events.map(event => ({
            title: `${brideName} & ${groomName} ${event.title}`,
            start: `${event.date}T${event.time}`,
            end: `${event.date}T${event.endTime}`,
            location: event.location,
            description: `You're invited to ${event.title} of ${brideName} and ${groomName}!\n\nDate: ${formatDate(event.date)}\nTime: ${formatTime(event.time)}\nVenue: ${event.location}\n\nLocation Map: ${event.mapLink}`
        }));

        const icsContent = generateICS(calendarEvents);
        downloadFile(icsContent, 'wedding_invite.ics');
    });
    function formatDate(dateStr) {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function formatTime(timeStr) {
        const hours = parseInt(timeStr.substring(0, 2));
        const minutes = timeStr.substring(2, 4);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    }

    function generateICS(events) {
        const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Manisha&Nayan Wedding//Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH\n`;

        events.forEach(event => {
            icsContent += `BEGIN:VEVENT
UID:${Math.random().toString(36).substring(2, 15)}@wedding.com
DTSTAMP:${now}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT\n`;
        });

        icsContent += 'END:VCALENDAR';
        return icsContent;
    }

    function downloadFile(data, filename) {
        const blob = new Blob([data], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});