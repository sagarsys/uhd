import { POST } from './helpers';
import validator from 'validator';

if (document.querySelector('.col-btn.continue .btn')) {
	document.querySelector('.col-btn.continue .btn').addEventListener('click', (e) => {

		e.preventDefault();

		hideErrors('.form-input');
		validate('.form-input')
			.then((validation) => {
				// console.log('Validate Then', validation);
				// if valid, post data to quiz
				if (validation.valid) {
					POST('/user', validation.inputs)
						.then((resp) => {
							location.href = resp.url;
						})
						.catch((err) => console.warn(err))
					;
				}
				// else display error messages
				else {
					displayError('.form-input', validation.inputs);
				}
			})
			.catch(err => console.warn(err));

	}, false);
}

const validate = async (form) => {
	const $form = document.querySelector(form);
	if ($form) {
		const $inputs = $form.querySelectorAll('input');

		const validation = {
			valid: true,
			inputs: []
		};

		await $inputs.forEach(($input) => {
			const name = $input.name;
			const value = $input.value.trim();
			const type = $input.type;

			const input = {
				name,
				value,
				type,
				valid: true,
				error: null
			};

			switch ( name ) {
				case 'nom':
				case 'prenom':
					const minlength = parseInt($input.getAttribute('minlength'), 10);
					input.valid = validator.isAlpha(value)
						&& !validator.isEmpty(value)
						&& value.length >= minlength;
					if ( !input.valid ) {
						const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
						validation.valid = false;
						if ( validator.isEmpty(value) ) {
							input.error = `${ formattedName } cannot be empty.`
						} else if ( !validator.isAlpha(value) ) {
							input.error = `${ formattedName } can only contain letters A-Z & a-z.`
						} else if ( value.length < minlength ) {
							input.error = `${ formattedName } must be at least ${ minlength } characters.`
						}
					}
					break;
				case 'email':
					input.valid = validator.isEmail(value) && !validator.isEmpty(value);
					if ( !input.valid ) {
						const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
						validation.valid = false;
						if ( validator.isEmpty(value) ) {
							input.error = `${ formattedName } cannot be empty.`
						} else if ( !validator.isEmail(value) ) {
							input.error = `${ formattedName } is invalid.`
						}
					}
					break;
				case 'adresse':
					input.valid = !validator.isEmpty(value);
					if ( !input.valid ) {
						const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
						validation.valid = false;
						if ( validator.isEmpty(value) ) {
							input.error = `${ formattedName } cannot be empty.`
						}
					}
					break;
				case 'codePostal':
					input.valid = !validator.isEmpty(value) && validator.isPostalCode(value, 'FR');
					if ( !input.valid ) {
						validation.valid = false;
						if ( validator.isEmpty(value) ) {
							input.error = `Postal code cannot be empty.`
						} else if ( !validator.isPostalCode(value, 'FR') ) {
							input.error = `Invalid French postal code`
						}
					}
					break;
				case 'ville':
					input.valid = validator.isAlpha(value)
						&& !validator.isEmpty(value);
					if ( !input.valid ) {
						const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
						validation.valid = false;
						if ( validator.isEmpty(value) ) {
							input.error = `${ formattedName } cannot be empty.`
						} else if ( !validator.isAlpha(value) ) {
							input.error = `${ formattedName } can only contain letters A-Z & a-z.`
						}
					}
					break;
				case 'declare':
					input.valid = !validator.isEmpty(value)
						&& value === 'true';
					if (!input.valid) {
						validation.valid = false;
						if (value === 'false') {
							input.error = `You MUST accept the subscription.`
						}
					}
					break;
			}
			validation.inputs.push(input)
		});
		return await validation;
	}
	return await new DOMException('Form not found');
};

const displayError = (form, inputs) => {
	const $form = document.querySelector(form);
	inputs.map((input) => {
		const $input = $form.querySelector(`input[name=${input.name}]`);
		const $parent = $input.parentElement;
		const $error = $parent.querySelector('.error');
		if (!input.valid) {
			$parent.classList.add('has-error');
			$error.innerHTML = input.error;
			$error.classList.remove('hide')
		}
		if (input.type === 'checkbox') {
			console.warn($parent, $error)
		}
	});
};

const hideErrors = (form) => {
	const $form = document.querySelector(form);
	const $formGroups = $form.querySelectorAll('.form-group');
	const $check = $form.querySelector('.checkbox-button');

	$formGroups.forEach((formGroup) => {
		if (formGroup.classList.contains('has-error')) {
			formGroup.classList.remove('has-error');
			const $error = formGroup.querySelector('.error');
			$error.classList.add('hide');
			$error.innerHTML = '';
		}
	});

	if ($check.classList.contains('has-error')) {
		$check.classList.remove('has-error');
		const $error = $check.querySelector('.error');
		$error.classList.add('hide');
		$error.innerHTML = '';
	}

};
