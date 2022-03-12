#!/bin/bash
set -e

curl -s get.sdkman.io | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install groovy
groovy -version


cd .jenkins/groovy
groovy -version
jenkinsUtils.buildAndPushImageToEcr
