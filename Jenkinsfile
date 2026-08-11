pipeline {

    agent any

    stages {

        // ==========================================
        // 1. CHECKOUT
        // ==========================================

        stage('Checkout') {

            steps {

                checkout scm
            }
        }


        // ==========================================
        // 2. INSTALL DEPENDENCIES
        // ==========================================

        stage('Install Dependencies') {

            steps {

                bat 'npm ci'
            }
        }


        // ==========================================
        // 3. INSTALL PLAYWRIGHT
        // ==========================================

        stage('Install Playwright Browsers') {

            steps {

                bat 'npx playwright install'
            }
        }


        // ==========================================
        // 4. RUN TESTS
        // ==========================================

        stage('Run Playwright Tests') {

            steps {

                bat 'npx playwright test'
            }
        }


        // ==========================================
        // 5. GENERATE ALLURE REPORT
        // ==========================================

        stage('Generate Allure Report') {

            steps {

                bat '''
                    npx allure generate allure-results --clean -o allure-report
                '''
            }
        }
    }


    // ==============================================
    // POST EXECUTION
    // ==============================================

    post {

        always {

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

            archiveArtifacts(
                artifacts: 'allure-report/**',
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