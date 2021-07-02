
const app = new Vue({
    el: '#app',
    data: {
        users: [],
        sortBy: 'name',
        direction: 'asc',
        counter: 0,
        dateTime: new Date(Date.now() + (10 * 60 * 1000))
    },
    mounted() {
        if (!localStorage.counter) localStorage.counter = this.counter;
        if (!localStorage.dateTime) localStorage.dateTime = this.dateTime;
    },
    methods: {
        getUser: function () {
            // Check counter
            this.counter = localStorage.counter;
            this.dateTime = localStorage.dateTime;

            // Check Time
            var now = new Date;

            // Reset DateTime and counter after 10 min
            if (new Date(now).getTime() > new Date(this.dateTime).getTime()) {
                localStorage.counter = 0;
                localStorage.dateTime = new Date(Date.now() + (10 * 60 * 1000))
                this.dateTime = localStorage.dateTime;
                this.counter = localStorage.counter;
            }

            if (this.counter > 9) {
                var diffMs = (new Date(this.dateTime).getTime() - new Date(now).getTime()); // milliseconds between now & Christmas
                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                alert("You exceeded the limit! Please wait " + diffMins + " min or open a new browser.");
                return;
            }

            this.counter++;
            localStorage.counter = this.counter
            // Fetch a user
            fetch('https://localhost:5001/api/users/random')
                .then(res => res.json())
                .then(res => {
                    this.users.push(res);
                })
        },
        // Get sorting order
        sort: function (item) {
            if (item == this.sortBy) {
                this.direction = this.direction == 'asc' ? 'desc' : 'asc';
            }
            this.sortBy = item;
            //console.log("sort by: " + item + ", direction: " + this.direction);

            // Sort 
            this.users.sort((a, b) => {
                // direction: asc == 1, desc == -1
                var direction = 1;
                if (this.direction === 'desc') direction = -1;
                if (a[this.sortBy] > b[this.sortBy]) return 1 * direction;
                if (a[this.sortBy] < b[this.sortBy]) return -1 * direction;
                return 0;
            });
        }
    },
    computed: {
        Users: function () {
            return this.users;
        }
    }
})
