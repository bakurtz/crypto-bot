pipeline {
    agent { docker { image 'node:10.16.0' } }
    stages {
        // stage('Test') {
        //     steps {
        //         sh './jenkins/scripts/test.sh'
        //     }
        // }
        stage('Build') { 
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