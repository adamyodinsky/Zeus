#!/bin/bash -e
#set -x

mem="${3}"
cpu="${4}"
replicas="${5}"

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
                                  --set mem="${mem}" \
                                  --set cpu="${cpu}" \
                                  --set replicas="${replicas}" \
                                  --output-dir "manifests/demoService-${letter}-${host_num}"
}

prompt_for_action() {
  msg="${1}"
  command="${2}"

  echo ''
  while true; do
      read -p "${msg}" yn
      case $yn in
          [Yy]* ) set -x && $command && set +x; break;;
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

help() {
  echo "Arguments:
  1 - letter / the id of the chain deployment
  2 - length of deployments chain
  3 - mem request
  4 - cpu request
  5 - replicas
  if you want to delete enter 'delete' as 1st agrument.
  "
  exit 0
}

if [[ "${1}" == "delete" ]]; then
  delete_resources && delete_manifests
elif [[ "${1}" == '-h' ]] || [[ "${1}" == '' ]]; then
  help
else
  generate_chain_templates "${1}" "${2}"
  apply_resources
fi
