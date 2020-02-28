#!/bin/bash -e
#set -x


helm_template() {
  local letter="${1}"
  local host_num="${2}"
  local non_leaf="${3}"
  local target_num=$((host_num + 1))

  helm template demoServiceChart  --set letter="${letter}" \
                                  --set num="${host_num}" \
                                  --set target_host="demoservice-${letter}-${target_num}" \
                                  --set host_port=3000 \
                                  --set target_port=3000 \
                                  --set non_leaf="${non_leaf}" \
                                  --output-dir "manifests/demoService-${letter}-${host_num}"
}


prompt_for_action() {
  msg="${1}"
  command="${2}"

  echo ''
  while true; do
      read -p "${msg}" yn
      case $yn in
          [Yy]* ) command; break;;
          [Nn]* ) echo "exiting script.." && exit;;
          * ) echo "Please answer yes or no.";;
      esac
  done
}

apply_resources() {
  prompt_for_action "Do you wish to apply resources?  " "kubectl -n apps apply --recursive -f ./manifests"
}

delete_manifests() {
  prompt_for_action "Do you wish to delete manifests?  " "rm -rf ./manifests/* | echo 'yes'"
}

delete_resources() {
  prompt_for_action "Do you wish to delete resources?  " "kubectl -n apps delete --recursive -f ./manifests"
}


generate_chain_templates(){
  local letter="${1}"
  local length="${2}"
  local non_leaf="true"

  for((i=0; i<length; i++)); do
    if ((i == length - 1)); then # if it is the last iteration
      non_leaf="false"
    fi

    helm_template "${letter}" "${i}" "${non_leaf}"
  done

}

generate_chain_templates "${1}" "${2}"
apply_resources
