import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ContainsNumberAndSpecial(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'containsNumberAndSpecial',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const containsNumber = /\d/.test(value);
          const containsSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
            value,
          );
          return containsNumber && containsSpecial;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain at least one number and one special character`;
        },
      },
    });
  };
}
