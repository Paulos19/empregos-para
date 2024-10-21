deploy:
	make bundle
	make upload_bundle
	make upload_deploy_script
	make execute_deploy_script

bundle:
	zip -r bundle.zip . -x node_modules/\* -x .git/\* -x .next/\* -x bundle.zip -x .env

upload_bundle:
	scp -i empregospara.pem bundle.zip ubuntu@3.142.124.230:

upload_deploy_script:
	scp -i empregospara.pem deploy.sh ubuntu@${HOST}:

execute_deploy_script:
	ssh -i empregospara.pem ubuntu@${HOST} "./deploy.sh"
