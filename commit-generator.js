const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

// Function to get random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to make commits
const makeCommit = (date) => {
    const data = {
        date: date
    };

    jsonfile.writeFile(FILE_PATH, data, (err) => {
        if (err) {
            console.log('Error writing file:', err);
            return;
        }
        
        simpleGit().add([FILE_PATH]).commit(date, {'--date': date}, (err) => {
            if (err) {
                console.log('Error committing:', err);
            } else {
                console.log('Commit created for:', date);
            }
        });
    });
};

// Generate commits from 2025-08-30 to 2025-12-02
const startDate = moment('2025-08-30');
const endDate = moment('2025-12-02');

let currentDate = startDate.clone();

// Use setTimeout to avoid overwhelming Git
let delay = 0;
let totalCommits = 0;

while (currentDate.isSameOrBefore(endDate, 'day')) {
    // Random number of commits per day (1 to 1)
    const commitsToday = getRandomInt(1, 1);
    
    // Generate random times for commits throughout the day
    const commitTimes = [];
    for (let i = 0; i < commitsToday; i++) {
        const hour = getRandomInt(0, 23);
        const minute = getRandomInt(0, 59);
        commitTimes.push({ hour, minute });
    }
    
    // Sort commit times chronologically
    commitTimes.sort((a, b) => {
        if (a.hour !== b.hour) return a.hour - b.hour;
        return a.minute - b.minute;
    });
    
    // Create commits at the random times
    commitTimes.forEach(time => {
        const commitDate = currentDate.clone()
            .hour(time.hour)
            .minute(time.minute)
            .format();
        
        setTimeout(() => {
            makeCommit(commitDate);
        }, delay);
        
        delay += 100; // 100ms delay between each commit
        totalCommits++;
    });
    
    currentDate.add(1, 'day');
}

console.log(`Total commits to be created: ${totalCommits}`);

// Push after all commits are done
setTimeout(() => {
    console.log('Pushing to repository...');
    simpleGit().push('origin', 'main', (err) => {
        if (err) {
            console.log('Error pushing:', err);
        } else {
            console.log('Successfully pushed all commits!');
        }
    });
}, delay + 1000); // Push after all commits are done