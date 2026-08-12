pipeline {

    agent any

    environment {

        BASE_URL =
            'https://eventhub.rahulshettyacademy.com'

        API_BASE_URL =
            'https://api.eventhub.rahulshettyacademy.com/api'

        TEST_USER_EMAIL =
            credentials('eventhub-test-email')

        TEST_USER_PASSWORD =
            credentials('eventhub-test-password')
    }

    stages {

        // ==========================================
        // CHECKOUT
        // ==========================================

        stage('Checkout') {

            steps {
                checkout scm
            }
        }


        // ==========================================
        // INSTALL DEPENDENCIES
        // ==========================================

        stage('Install Dependencies') {

            steps {
                bat 'npm ci'
            }
        }


        // ==========================================
        // INSTALL PLAYWRIGHT
        // ==========================================

        stage('Install Playwright Browsers') {

            steps {
                bat 'npx playwright install chromium'
            }
        }


        // ==========================================
        // RUN TESTS
        // ==========================================

        stage('Run Playwright Tests') {

            steps {

                catchError(
                    buildResult: 'FAILURE',
                    stageResult: 'FAILURE'
                ) {

                    bat 'npx playwright test'
                }
            }
        }


        // ==========================================
        // ALLURE REPORT
        // ==========================================

        stage('Generate Allure Report') {

            steps {

                allure([
                    results: [
                        [path: 'allure-results']
                    ]
                ])
            }
        }
    }


    // ==============================================
    // POST ACTIONS
    // ==============================================

    post {

        always {

            echo 'Collecting test artifacts...'

            archiveArtifacts(
                artifacts: 'playwright-report/**',
                allowEmptyArchive: true
            )

            archiveArtifacts(
                artifacts: 'test-results/**',
                allowEmptyArchive: true
            )

            archiveArtifacts(
                artifacts: 'allure-results/**',
                allowEmptyArchive: true
            )
        }


        success {

            echo '========================================'
            echo 'PLAYWRIGHT AUTOMATION PASSED'
            echo '========================================'
        }


        failure {

            echo '========================================'
            echo 'PLAYWRIGHT AUTOMATION FAILED'
            echo 'CHECK ALLURE AND PLAYWRIGHT REPORTS'
            echo '========================================'
        }
    }
}