pipeline {
    stages {
        // stage('Test') {
        //     steps {
        //         sh './jenkins/scripts/test.sh'
        //     }
        // }
        stage('Deliver') { 
            steps {
                sh 'npm install'
                sh 'cd client'
                sh 'npm install'
                sh 'cd ..'
                sh 'npm run build'
            }
        }
    }
}