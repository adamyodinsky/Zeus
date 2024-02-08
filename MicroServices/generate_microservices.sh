#!/bin/bash -e
# set -x
mem=${3:-64}
cpu=${4:-20}
replicas="${5:-1}"

get_script_dir() {
    local script_path="${BASH_SOURCE[0]:-$0}" # BASH_SOURCE[0] is more reliable than $0 for sourcing
    while [ -h "$script_path" ]; do # Resolve $script_path until the file is no longer a symlink
        local dir="$(cd -P "$(dirname "$script_path")" && pwd)"
        script_path="$(readlink "$script_path")"
        # If $script_path was a relative symlink (so no '/' as prefix),
        # we need to resolve it relative to the path where the symlink file was located
        [[ $script_path != /* ]] && script_path="$dir/$script_path"
    done
    echo "$(cd -P "$(dirname "$script_path")" && pwd)"
}

helm_install() {
  local letter="${1}"
  local host_num="${2}"
  local non_leaf="${3}"
  local target_num=$((host_num + 1))
  local script_dir=$(get_script_dir)

  helm install demo-service-${letter}-${host_num} ${script_dir}/demoServiceChart/ \
    --set letter="${letter}" \
    --set num="${host_num}" \
    --set target_host="demoservice-${letter}-${target_num}" \
    --set host_port=3000 \
    --set target_port=3000 \
    --set non_leaf="${non_leaf}" \
    --set mem="${mem}" \
    --set cpu="${cpu}" \
    --set replicas="${replicas}"
}

install_chain_services(){
  local letter="${1}"
  local length="${2}"
  local non_leaf="true"

  for((i=0; i<length; i++)); do
    if ((i == length - 1)); then # if it is the last iteration
      non_leaf="false"
    fi

    helm_install "${letter}" "${i}" "${non_leaf}"
  done

}

help() {
  echo """
  Arguments:
  1 - letter / the id of the chain deployment
  2 - length of deployments chain
  3 - mem request
  4 - cpu request
  5 - replicas
  if you want to delete enter 'delete' as 1st agrument.
  """
  exit 0
}


if [[ "${1}" == '-h' ]] || [[ "${1}" == '' ]]; then
  help
else
  install_chain_services "${1}" "${2}"
fi
