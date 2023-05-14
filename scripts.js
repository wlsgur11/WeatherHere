// WeatherAPI 관련 설정
const apiKey = "a0cc9a825170452e91c105216231305"; // WeatherAPI에서 발급받은 API 키를 사용하세요.
const apiUrl = "https://api.weatherapi.com/v1/current.json";
const agifyApiUrl = "https://api.agify.io";

// 현재 위치 날씨 정보 조회
document.getElementById("get-location-weather").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude.toFixed(2);
    const lon = position.coords.longitude.toFixed(2);
    const url = `${apiUrl}?key=${apiKey}&q=${lat},${lon}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const location = data.location.name;
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;

        const weatherInfo = `위치: ${location}<br>현재 온도: ${temperature}℃<br>날씨 상태: ${condition}`;
        document.getElementById("weatherInfo").innerHTML = weatherInfo;
      })
      .catch((error) => {
        console.error("Error fetching location weather:", error);
      });
  });
});

// 도시별 날씨 정보 조회
document.getElementById("city-search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = event.target.elements["input_text1"].value;
  const url = `${apiUrl}?key=${apiKey}&q=${city}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const location = data.location.name;
      const temperature = data.current.temp_c;
      const condition = data.current.condition.text;

      const weatherInfo = `위치: ${location}<br>현재 온도: ${temperature}℃<br>날씨 상태: ${condition}`;
      document.getElementById("weatherInfo").innerHTML = weatherInfo;

      addToPopularSearch(city);
    })
    .catch((error) => {
      console.error("Error fetching city weather:", error);
    });
});

// 인기 검색어 추가
const popularSearches = {};

function addToPopularSearch(searchTerm) {
  const tableBody = document.querySelector("#popular-search-table tbody");

  // 추가할 검색어를 소문자로 변환하고 앞뒤 공백을 제거합니다.
  searchTerm = searchTerm.toLowerCase().trim();

  // 인기 검색어 목록에 이미 추가된 검색어인지 확인합니다.
  if (!popularSearches.hasOwnProperty(searchTerm)) {
    // 새로운 검색어로 등록하고 횟수를 1로 설정합니다.
    popularSearches[searchTerm] = 1;
  } else {
    // 이미 등록된 검색어라면 검색 횟수를 증가시킵니다.
    popularSearches[searchTerm]++;
  }

  // 테이블에 있는 기존 검색어 목록을 삭제합니다.
  tableBody.innerHTML = '';

  // 검색 횟수를 기준으로 인기 검색어 목록을 정렬합니다.
  const sortedKeywords = Object.entries(popularSearches).sort((a, b) => b[1] - a[1]);

  // 정렬된 검색어 목록을 테이블에 다시 추가합니다.
  sortedKeywords.forEach(([keyword, count]) => {
    const newRow = document.createElement("tr");
    const newCell = document.createElement("td");
    newCell.textContent = keyword;
    newRow.appendChild(newCell);
    tableBody.appendChild(newRow);
  });

}


// 이름으로 나이 추측
document.getElementById("name-to-age-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = event.target.elements["input_text2"].value;
  const url = `${agifyApiUrl}?name=${name}`;

  

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let age = data.age - 12;
      const count = (data.count / 1000); // 백분율을 소수점 둘째 자리까지 표시하도록 수정
      //만약 count값이 0일때 극도로 작은 값을 출력
      let newcount;
      if (count === 0) {
        newcount = "이런 이름은 처음이네요..";
      }
      else{
        newcount = count + "%";
      }
      // 나이에 따른 메시지 출력 조건문 추가
      let ageMessage;
      if (age < 10 && age > 0) {
        ageMessage = "혹시 아기이신가요..?";
      } else if (age >= 40) {
        ageMessage = "40살은 족히..";
      }else if (age < 1){
        ageMessage = "세상에 단 하나뿐인 이름을 가지셨네요!"
      }else {
        ageMessage = `예측 나이: ${age}`;
      }

      const nameToAgeResult = `이름: <strong style="font-size: x-large;">${name}</strong><br><strong style="font-size: larger;">${ageMessage}</strong><br>같은 이름 비율: <strong style="font-size: larger;">${newcount}</strong>`;
      document.getElementById("nameToAgeResult").innerHTML = nameToAgeResult;
    })
    .catch((error) => {
      console.error("Error fetching age prediction:", error);
    });
});





// 메뉴의 "이름 나이 추측" 버튼을 클릭했을 때 동작 설정
document.getElementById("name-to-age-menu").addEventListener("click", () => {
  const nameToAgeSection = document.getElementById("name-to-age");
  const currentDisplayStyle = getComputedStyle(nameToAgeSection).display;

  if (currentDisplayStyle === "none") {
    nameToAgeSection.style.display = "block";
  } else {
    nameToAgeSection.style.display = "none";
  }
});

document.getElementById("popular-search-menu").addEventListener("click", () => {
  const popularSearchSection = document.getElementById("popular-searches");
  const currentDisplayStyle = getComputedStyle(popularSearchSection).display;

  if (currentDisplayStyle === "none") {
    popularSearchSection.style.display = "block";
  } else {
    popularSearchSection.style.display = "none";
  }
});

document.getElementById("city-weather-menu").addEventListener("click", () => {
  const cityWeatherSection = document.getElementById("weather-by-city");
  const currentDisplayStyle = getComputedStyle(cityWeatherSection).display;

  if (currentDisplayStyle === "none") {
    cityWeatherSection.style.display = "block";
  } else {
    cityWeatherSection.style.display = "none";
  }
});
