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
                sh 'echo *********************'
                sh 'echo $USER'
                sh 'pwd'
                sh 'echo *********************'
            }
        }
    }
}