pipeline {
    agent { docker { 
        image 'node:10.16.0' 
        args '-p 5000:5000'
    } }
    environment {
        HOME = '.'
    }
    stages {
        // stage('Test') {
        //     steps {
        //         sh './jenkins/scripts/test.sh'
        //     }
        // }
        stage('Build') { 
            steps {
                sh './deploy.sh'
            }
        }
    }
}


// pipeline {
//     agent { docker { 
//         image 'node:10.16.0' 
//         args '-p 5001:5001'
//     } }
//     environment {
//         HOME = '.'
//     }
//     stages {
//         // stage('Test') {
//         //     steps {
//         //         sh './jenkins/scripts/test.sh'
//         //     }
//         // }
//         stage('Build') { 
//             steps {
//                 sh 'echo *********************'
//                 sh 'echo $USER'
//                 sh 'echo NOW PRINTING THE PWD'
//                 dir("client") {
//                     sh 'pwd'
//                     sh 'npm install'
//                     sh 'npm run build'
//                     sh 'npm install serve'
//                     sh './node_modules/serve/bin/serve.js -c 0 -s build -l 5001 &'
//                     sh 'sleep 1'
//                     sh 'echo $! > .pidfile'
//                     sh 'pwd'
//                 }
//                 sh 'pwd'
//                 sh 'echo WHAT IS SHOWN ABOVE? CLIENT OR ROOT?'
//                 sh 'echo *********************'
                
                
//             }
//         }
//     }
// }