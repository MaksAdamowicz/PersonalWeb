const SUPABASE_URL = 'https://lsuwpborfzjjmtboajht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzdXdwYm9yZnpqam10Ym9hamh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODgzMTEsImV4cCI6MjA0NzI2NDMxMX0.gqe63IPUIhZi5mlnCN5xMkRY54W9TBVlIgu6FarSs1Q';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let user; // Declare a global variable for user

document.addEventListener('DOMContentLoaded', async function() {
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
alert('You need to log in first.');
window.location.href = 'login.html';
return;
}

let calendarEl = document.getElementById('calendar');

// Initialize FullCalendar instance
let calendar = new FullCalendar.Calendar(calendarEl, {
initialView: 'dayGridMonth',
events: [],
eventClick: function(info) {
    document.getElementById('modal-title').innerText = info.event.title.split(' (')[0];
    document.getElementById('modal-date').innerText = info.event.startStr;
    document.getElementById('modal-intensity').innerText = info.event.extendedProps.intensity;
    document.getElementById('modal-bodyPart').innerText = info.event.extendedProps.bodyPart;
    document.getElementById('modal-description').innerText = info.event.extendedProps.description || '';
    document.getElementById('training-modal').style.display = 'block';
}
});

// Render the calendar
calendar.render();
    

    // Fetch trainings from Supabase
    async function fetchTrainings() {
const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('user_id', user.id);

if (error) {
    console.error('Error fetching trainings:', error.message);
    return;
}

if (data) {
    data.forEach(training => {
        calendar.addEvent({
            title: `${training.body_part} (${training.intensity})`,
            start: training.date,
            description: training.description,
            extendedProps: {
                intensity: training.intensity,
                bodyPart: training.body_part
            }
        });
    });
}
}

// Fetch trainings on page load
await fetchTrainings();

    async function saveTrainingToSupabase(training) {
        const { error } = await supabase
            .from('trainings')
            .insert([training]);

        if (error) {
            console.error('Error saving training:', error.message);
            alert('Error saving training.');
            return;
        }

        alert('Training saved successfully.');
    }

    document.getElementById('training-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const intensity = document.getElementById('intensity').value;
        const bodyPart = document.getElementById('bodyPart').value;

        const newTraining = {
            user_id: user.id,
            date,
            intensity,
            body_part: bodyPart,
            description: '',
            training_type: 'Standard'
        };

        await saveTrainingToSupabase(newTraining);
        calendar.addEvent({
            title: `${bodyPart} (${intensity})`,
            start: date,
            description: ''
        });
        e.target.reset();
    });

    document.getElementById('add-custom-training').addEventListener('click', async function() {
        const customName = document.getElementById('custom-name').value;
        const customBodyPart = document.getElementById('custom-body-part').value;
        const customDescription = document.getElementById('custom-description').value;

        const customTraining = {
            user_id: user.id,
            date: new Date().toISOString().split('T')[0], // today's date for simplicity
            intensity: 'Custom',
            body_part: customBodyPart,
            description: customDescription,
            training_type: 'Custom'
        };

        await saveTrainingToSupabase(customTraining);
        calendar.addEvent({
            title: `${customBodyPart} (Custom)`,
            start: customTraining.date,
            description: customDescription
        });
    });

    // Fetch trainings and display in calendar, My Trainings, and Training List
async function fetchTrainings() {
const { data, error } = await supabase
.from('trainings')
.select('*')
.eq('user_id', user.id);

if (error) {
console.error('Error fetching trainings:', error.message);
return;
}

if (data) {
// Clear existing content in the My Trainings and Training List divs
document.getElementById('custom-training-list').innerHTML = '<h2>My Trainings</h2>';
document.getElementById('training-list').innerHTML = '<h2>Trainings List</h2>';

data.forEach(training => {
    // Add training to the calendar
    calendar.addEvent({
        title: `${training.body_part} (${training.intensity})`,
        start: training.date,
        description: training.description,
        extendedProps: {
            intensity: training.intensity,
            bodyPart: training.body_part
        }
    });

    // Display training in the "My Trainings" div if it's custom
    if (training.training_type === 'Custom') {
        const customTrainingEntry = document.createElement('div');
        customTrainingEntry.className = 'training-entry';
        customTrainingEntry.innerHTML = `
            <strong>${training.body_part}</strong> (${training.intensity})<br>
            <em>${training.description}</em><br>
            Date: ${training.date}
        `;
        document.getElementById('custom-training-list').appendChild(customTrainingEntry);
    }

    // Display all trainings in the "Trainings List" div
    const trainingEntry = document.createElement('div');
    trainingEntry.className = 'training-entry';
    trainingEntry.innerHTML = `
        <strong>${training.body_part}</strong> (${training.intensity})<br>
        Date: ${training.date}
    `;
    document.getElementById('training-list').appendChild(trainingEntry);
});
}
}


    // Fetch and render all trainings on load
    await fetchTrainings();
});
// Close button functionality for the modal
document.querySelector('.modal .close').addEventListener('click', function() {
    document.getElementById('training-modal').style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('training-modal')) {
        document.getElementById('training-modal').style.display = 'none';
    }
});

        
document.getElementById('delete-event').addEventListener('click', async function() {
const event = calendar.getEventById(eventId);  // Get the event by ID
if (event) {
    const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', event.extendedProps.trainingId); // Assuming eventId is saved in extendedProps

    if (error) {
        console.error('Error deleting training:', error.message);
        alert('Error deleting training.');
        return;
    }

    event.remove(); // Remove event from the calendar
    alert('Training deleted successfully.');
    document.getElementById('training-modal').style.display = 'none'; // Close the modal
}
});



document.getElementById('logout-button').addEventListener('click', async function() {
const { error } = await supabase.auth.signOut();
if (error) {
    console.error('Error logging out:', error.message);
    alert('Error logging out. Please try again.');
    return;
}
alert('Logged out successfully.');
window.location.href = 'login.html'; // Redirect to the login page
});


