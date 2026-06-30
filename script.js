// ==================== FOOD DATABASE ====================

const foods = {
    "Afresh": 4,
    "Aloo Chop": 100,
    "Almond (piece wise)": 7,
    "Beguni": 60,
    "Black Coffee": 4,    
    "Black Jamun 100g": 60,
    "Chanachur (cup wise)": 170,
    "Chicken 100g": 183,
    "Chicken Biryani (Half Plate)": 400,
    "Chocolate biscuit": 130,
    "Chocolate Ice Cream 1 Cup": 300,
    "Coffee": 50,
    "Cucumber 100g": 15,
    "Dahi with Seed Mix": 83,
    "Egg": 75,
    "Fish Fry": 180,
    "Herbal Protein Shake": 94,
    "Katla Fish 100g": 130,
    "Liquor Tea 1 Cup": 3,
    "Marie Gold": 30,
    "Milk": 42,
    "Milk tea": 50,
    "Mixed Fried Rice Half Plate": 350,
    "Moong Dalia (1 cup)": 135,
    "Mutton 100g": 275,
    "Mutton Liver 100g": 180,
    "Papaya 100g": 43,
    "Pomfret Fish 100g": 120,
    "Pomegranate 100g": 83,
    "Prawn 100g": 100,
    "Rohu Fish 100g": 120,
    "Roti": 85,
    "Sabji with Rice": 800,
    "Small Pastry": 260,
    "Wheat Bread Veg Cheese Sandwich": 350
};
// ==================== FOOD DROPDOWN ====================

const datalist = document.getElementById("foods");

for (let food in foods) {
    const option = document.createElement("option");
    option.value = food;
    datalist.appendChild(option);
}

// ==================== SAVE PROFILE ====================

function saveProfile() {

    const age = Number(document.getElementById("age").value);
    const weight = Number(document.getElementById("weight").value);
    const height = Number(document.getElementById("height").value);

    if (!age || !weight || !height) {
        alert("Please fill all details.");
        return;
    }

    localStorage.setItem(
        "profile",
        JSON.stringify({
            age,
            weight,
            height
        })
    );

    calculateHealthyCalories();
}

// ==================== FEMALE CALORIE NEED ====================


function calculateHealthyCalories() {

    const profile =
        JSON.parse(
            localStorage.getItem("profile")
        );

    if (!profile) return 0;

    const age = Number(profile.age);
    const weight = Number(profile.weight);
    const height = Number(profile.height);

    // Female BMR
    const bmr =
        (10 * weight) +
        (6.25 * height) -
        (5 * age) -
        161;

    // Sedentary maintenance calories
    const maintenance =
        bmr * 1.2;

    // Weight-loss calories
    let target =
        Math.round(maintenance - 500);

    // Safe lower limit
    target = Math.max(target, 1200);

    document.getElementById(
        "healthyCal"
    ).innerText = target;

    return target;
}


// ==================== DATE ====================

function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ==================== LOAD DAILY DATA ====================

function loadDaily() {

    let data =
        JSON.parse(
            localStorage.getItem("calories")
        ) || {};

    const today = getToday();

    if (!data[today]) {
    data[today] = {
        total: 0,
        foods: []
    };
}

    // Keep only last 7 days
    const dates =
        Object.keys(data).sort();

    while (dates.length > 7) {
        delete data[dates.shift()];
    }

    localStorage.setItem(
        "calories",
        JSON.stringify(data)
    );

    document.getElementById(
        "todayCal"
    ).innerText = data[today].total;

    updateRemaining();
    renderHistory();
    updateChart();
    renderTodayFoods();
}
function renderTodayFoods() {

    const container =
        document.getElementById(
            "todayFoods"
        );

    if (!container) return;

    container.innerHTML = "";

    const data =
        JSON.parse(
            localStorage.getItem(
                "calories"
            )
        ) || {};

    const today =
        getToday();

    const foodsToday =
        data[today]?.foods || [];

    if (foodsToday.length === 0) {
        container.innerHTML =
            "<p>No food added today.</p>";
        return;
    }

    foodsToday.forEach((item, index) => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "food-item";

        div.innerHTML = `
            <strong>${item.name}</strong>
            <br>
            Qty: ${item.quantity}
            <br>
            ${item.calories} kcal
        `;

        container.appendChild(div);
    });
}

// ==================== ADD FOOD ====================

function addFood() {

    const food =
        document.getElementById(
            "foodSearch"
        ).value;

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        );

    if (!foods[food]) {
        alert("Select a valid food.");
        return;
    }

    if (quantity <= 0) {
        alert("Quantity should be greater than 0.");
        return;
    }

    let data =
        JSON.parse(
            localStorage.getItem("calories")
        ) || {};

    const today = getToday();

    if (!data[today]) {
    data[today] = {
        total: 0,
        foods: []
    };
}

const calories =
    foods[food] * quantity;

data[today].total += calories;

data[today].foods.push({
    name: food,
    quantity,
    calories
});

    localStorage.setItem(
        "calories",
        JSON.stringify(data)
    );

    document.getElementById(
        "foodSearch"
    ).value = "";

    document.getElementById(
        "quantity"
    ).value = 1;

    loadDaily();
}

// ==================== REMAINING CALORIES ====================

function updateRemaining() {

    const tdee =
        calculateHealthyCalories();

    let data =
        JSON.parse(
            localStorage.getItem("calories")
        ) || {};

    const today =
        getToday();

    const consumed =
    data[today]?.total || 0;

    const remaining =
        Math.max(
            tdee - consumed,
            0
        );

    document.getElementById(
        "remainingCal"
    ).innerText ="Remaining Calorie is "+ remaining +" kcal";
}

// ==================== HISTORY ====================

function renderHistory() {

    const history =
        document.getElementById("history");

    history.innerHTML = "";

    const data =
        JSON.parse(
            localStorage.getItem("calories")
        ) || {};

    const dates =
        Object.keys(data)
            .sort()
            .reverse();

    dates.forEach(date => {

        const div =
            document.createElement("div");

        div.className =
            "history-item";

        div.innerHTML = `
            <strong>${date}</strong>
            <br>
            🔥 ${data[date].total} kcal
        `;

        history.appendChild(div);
    });
}

// ==================== PIE CHART ====================

let calorieChart;

function updateChart() {

    const tdee =
        calculateHealthyCalories();

    if (!tdee) return;

    let data =
        JSON.parse(
            localStorage.getItem(
                "calories"
            )
        ) || {};

    const today =
        getToday();

    const consumed =
    data[today]?.total || 0;

    const remaining =
        Math.max(
            tdee - consumed,
            0
        );

    const ctx =
        document.getElementById(
            "calorieChart"
        );

    if (!ctx) return;

    if (calorieChart) {
        calorieChart.destroy();
    }

    calorieChart =
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: [
                    "Consumed",
                    "Remaining"
                ],
                datasets: [{
                    data: [
                        consumed,
                        remaining
                    ],
                    backgroundColor: [
                        "#2563eb",
                        "#d1d5db"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });

    updateProgressBar(
        consumed,
        tdee
    );
}

// ==================== PROGRESS BAR ====================

function updateProgressBar(
    consumed,
    target
) {
    const percentage =
        Math.min(
            (consumed / target) * 100,
            100
        );

    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";
}

// ==================== LOAD PROFILE ====================

function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem(
                "profile"
            )
        );

    if (!profile) return;

    document.getElementById(
        "age"
    ).value = profile.age;

    document.getElementById(
        "weight"
    ).value =
        profile.weight;

    document.getElementById(
        "height"
    ).value =
        profile.height;

    calculateHealthyCalories();
}

// ==================== INITIALIZE ====================

loadProfile();
loadDaily();
