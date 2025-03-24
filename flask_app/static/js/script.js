document.addEventListener('DOMContentLoaded', function () {
    const apiBtn = document.getElementById('api-btn');
    const apiResult = document.getElementById('api-result');

    if (apiBtn) {
        apiBtn.addEventListener('click', function () {
            fetch('/api/hello')
                .then(response => response.json())
                .then(data => {
                    apiResult.textContent = JSON.stringify(data);
                    apiResult.style.display = 'block';
                })
                .catch(error => {
                    apiResult.textContent = 'Error: ' + error.message;
                    apiResult.style.display = 'block';
                });
        });
    }
});
