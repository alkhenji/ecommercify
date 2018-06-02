from django.utils.text import slugify

'''
    Takes a model instance, sluggable field name of that model as a string,
    slug field name of the model as a string and returns a unique slug as a
    string.
'''
def get_unique_slug(model_instance, slugable_field_name, slug_field_name):

    slug = slugify(getattr(model_instance, slugable_field_name))
    unique_slug = slug
    extension = 1
    ModelClass = model_instance.__class__

    while ModelClass._default_manager.filter(
        **{slug_field_name: unique_slug}).exists():

        unique_slug = '{}-{}'.format(slug, extension)
        extension += 1

    return unique_slug
