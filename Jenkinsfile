pipeline {
    agent {
        docker {
            image 'node:10.20.1'
            args '-p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
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