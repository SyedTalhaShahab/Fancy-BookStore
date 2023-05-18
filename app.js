window.onload = function () {
    console.log("Page loaded");

    // Read JSON
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "data-file.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText);
            console.log(jsonData);
            // Perform JSON actions
        }
    };
    xhr.send();
};


// Fetch job listings data
fetch('data-file.json')
    .then(response => response.json())
    .then(data => {
        // Get container element
        const container = document.querySelector('#featured-jobs');

        // Get filter elements
        const locationFilter = document.querySelector('#location-filter');
        const keywordFilter = document.querySelector('#keyword-filter');
        const salaryFilter = document.querySelector('#salary-filter');

        // Listen for changes to filters
        locationFilter.addEventListener('input', filterJobs);
        keywordFilter.addEventListener('input', filterJobs);
        salaryFilter.addEventListener('input', filterJobs);

        // Function to filter jobs based on location, keywords, and salary
        function filterJobs() {
            // Get current filter values
            const locationValue = locationFilter.value.toLowerCase();
            const keywordValue = keywordFilter.value.toLowerCase();
            const salaryValue = salaryFilter.value;

            // Remove existing job listings
            while (container.firstChild)
                container.removeChild(container.firstChild);


            // Filter job listings based on location, keywords, and salary
            const filteredJobs = data.jobs.filter(job => {
                const locationMatch = job.location.toLowerCase().includes(locationValue);
                const keywordMatch = job.title.toLowerCase().includes(keywordValue) ||
                    job.description.toLowerCase().includes(keywordValue);
                const salaryMatch = job.salary.includes(salaryValue);
                return locationMatch && keywordMatch && salaryMatch;
            });

            // Create DOM elements for filtered job listings
            filteredJobs.forEach(job => {
                // Create job element
                const jobElement = document.createElement('div');
                jobElement.classList.add('job');

                // Create job title element
                const titleElement = document.createElement('h3');
                titleElement.textContent = job.title;
                jobElement.appendChild(titleElement);

                // Create location element
                const locationElement = document.createElement('h4');
                locationElement.textContent = job.location;
                jobElement.appendChild(locationElement);

                // Create description element
                const descriptionElement = document.createElement('h5');
                descriptionElement.textContent = job.description;
                jobElement.appendChild(descriptionElement);

                // Create salary element
                const salaryElement = document.createElement('p');
                salaryElement.textContent = job.salary;
                jobElement.appendChild(salaryElement);

                // Create Apply Now button
                const applyButton = document.createElement('button');
                applyButton.textContent = 'Apply Now';
                applyButton.addEventListener('click', () => {
                    // Rcode for handling Apply Now button click
                    window.open("https://www.example.com", "_blank");
                });
                jobElement.appendChild(applyButton);

                // Append job element to container
                container.appendChild(jobElement);
            });

            // Add CSS styling to job listings for uniform height and width
            const jobs = container.querySelectorAll('.job');
            const jobWidth = jobs[0].offsetWidth;
            jobs.forEach(job => {
                job.style.height = `${jobWidth}px`;
            });

            // Add CSS styling to container for even spacing
            const numCols = Math.floor(container.offsetWidth / jobWidth);
            const spacing = (container.offsetWidth - (numCols * jobWidth)) / (numCols - 1);
            container.style.display = 'grid';
            container.style.gridTemplateColumns = `repeat(${numCols}, ${jobWidth}px)`;
            container.style.gridColumnGap = `${spacing}px`;
            container.style.gridRowGap = `${spacing}px`;
        }

        // Populate job listings on page load
        filterJobs();
    });

