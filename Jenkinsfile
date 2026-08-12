pipeline {

    agent any

    environment {

        BASE_URL = 'https://eventhub.rahulshettyacademy.com'

        API_BASE_URL =
            'https://api.eventhub.rahulshettyacademy.com/api'

        TEST_USER_EMAIL =
            credentials('eventhub-test-email')

        TEST_USER_PASSWORD =
            credentials('eventhub-test-password')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

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
    }

    post {

        always {

            echo 'Collecting test reports...'

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
            echo 'Playwright automation execution PASSED'
        }

        failure {
            echo 'Playwright automation execution FAILED'
        }
    }
}