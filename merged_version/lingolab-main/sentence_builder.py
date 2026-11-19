'''
Sentences:

Hello! My name is ___. What is your name?

I want to dance 
I don't want to dance

I like blue turtles
You like tiny turtles
She likes fast turtles
He likes blue turtles
They like tiny turtles
We like fast turtles

I ate an apple
I eat an apple
I will eat an apple

I enjoyed the carrot
I enjoyed the carrots 
I enjoyed a carrot
I enjoyed carrots

Variable Structure
words = {"english_word": "new_word"} --- make sure to include determiner & possessive pronouns, allow to-be to be n/a
sentence_order = "order_key" --- ex: SVO
tenses = {"infinitive": ["placement", "marker"], "past":[placement, marker], "present":[placement, marker], "future":[placement, marker]}
has_conjugations = True
conjugations = {"first_single":[placement, marker], "first_plural":[placement, marker], "second_person":[placement, marker], "third_single_female":[placement, marker], "third_single_male":[placement, marker], "third_plural":[placement, marker]}
has_articles = True
articles = {"definite":"word", "indefinite":"word"}
negation = [placement, marker]
pluralizer = [placement, marker]
question_order = "order_key"
adj_placement = "spot" --- "before" or "after"

'''

# Attach each sentence to its key
sentence_dict = {
    "intro": "Hello! My name is ____. What's your name?",
    "dancing_yes": "I want to dance.",
    "dancing_no": "I don't want to dance.",
    "turtle_I": "I like blue turtles.",
    "turtle_you": "You like tiny turtles.",
    "turtle_she": "She likes fast turtles.",
    "turtle_he": "He likes blue turtles.",
    "turtle_they": "They like tiny turtles.",
    "turtle_we": "We like fast turtles.",
    "apple_past": "I ate an apple.",
    "apple_present": "I eat an apple.",
    "apple_future": "I will eat an apple.",
    "the_carrot": "I enjoyed the carrot.",
    "the_carrots": "I enjoyed the carrots.",
    "a_carrot": "I enjoyed a carrot",
    "carrots": "I enjoyed carrots"
}

# Establish sentence groups (by key)
dancing_sentences = ["dancing_yes", "dancing_no"]
turtle_sentences = ["turtle_I", "turtle_you", "turtle_she", "turtle_he", "turtle_they", "turtle_we"]
apple_sentences = ["apple_past", "apple_present", "apple_future"]
carrot_sentences = ["the_carrot", "the_carrots", "a_carrot", "carrots"]

# Language config (populated by apply_language_config from the create flow)
words = {}
sentence_order = "SVO"
tenses = {}
has_conjugations = False
conjugations = {}
has_articles = True
articles = {"definite": "", "indefinite": ""}
negation = ["before", ""]
pluralizer = ["suffix", ""]
question_order = "wiyn"
adj_placement = "before"
user_name = ""

_CONJ_PERSON_MAP = {
    "I": "first_single",
    "you": "second_person",
    "he": "third_single_male",
    "she": "third_single_female",
    "they": "third_plural",
    "we": "first_plural",
}

_TENSE_KEYS = ("infinitive", "present", "past", "future")

_DEFAULT_LEXICON = {
    "name": "name",
    "apple": "apple",
    "turtle": "turtle",
    "carrot": "carrot",
    "blue": "blue",
    "tiny": "tiny",
    "fast": "fast",
    "be": "be",
    "is": "be",
    "want": "want",
    "like": "like",
    "dance": "dance",
    "eat": "eat",
    "enjoy": "enjoy",
    "I": "I",
    "you": "you",
    "he": "he",
    "she": "she",
    "they": "they",
    "we": "we",
    "hello": "hello",
    "what": "what",
    "my": "my",
    "your": "your",
}


def normalize_placement(ui_value):
    if not ui_value:
        return "default"
    key = str(ui_value).strip().lower()
    mapping = {
        "separate-before": "before",
        "separate word before": "before",
        "separate-after": "after",
        "separate word after": "after",
        "prefix": "prefix",
        "suffix": "suffix",
        "word before": "before",
        "word after": "after",
        "before the verb — not wait": "before",
        "after the verb — wait not": "after",
        "before": "before",
        "after": "after",
        "default": "default",
    }
    return mapping.get(key, key)


def _tense_entry(placement_raw, marker_raw):
    placement = normalize_placement(placement_raw)
    marker = (marker_raw or "").strip()
    if not marker:
        return ["default", "default"]
    return [placement, marker]


def _conj_entry(placement_raw, marker_raw):
    placement = normalize_placement(placement_raw)
    marker = (marker_raw or "").strip()
    if not marker:
        return ["default", "default"]
    return [placement, marker]


def apply_language_config(data):
    global words, sentence_order, tenses, has_conjugations, conjugations
    global has_articles, articles, negation, pluralizer, question_order, adj_placement, user_name

    raw_words = dict(data.get("words") or {})
    words = {**_DEFAULT_LEXICON, **raw_words}
    if raw_words.get("be") and "is" not in raw_words:
        words["is"] = words["be"]

    sentence_order = data.get("sentence_order") or "SVO"
    adj_placement = data.get("adj_placement") or "before"
    question_order = data.get("question_order") or "wiyn"
    user_name = (data.get("user_name") or "").strip()

    tenses = {}
    incoming_tenses = data.get("tenses") or {}
    for key in _TENSE_KEYS:
        if key in incoming_tenses and isinstance(incoming_tenses[key], (list, tuple)):
            placement, marker = incoming_tenses[key][0], incoming_tenses[key][1] if len(incoming_tenses[key]) > 1 else ""
            tenses[key] = _tense_entry(placement, marker)
        else:
            tenses[key] = ["default", "default"]

    has_conjugations = bool(data.get("has_conjugations"))
    conjugations = {}
    incoming_conj = data.get("conjugations") or {}
    if has_conjugations:
        for person, backend_key in _CONJ_PERSON_MAP.items():
            if backend_key in incoming_conj and isinstance(incoming_conj[backend_key], (list, tuple)):
                placement = incoming_conj[backend_key][0]
                marker = incoming_conj[backend_key][1] if len(incoming_conj[backend_key]) > 1 else ""
                conjugations[backend_key] = _conj_entry(placement, marker)
            elif person in incoming_conj and isinstance(incoming_conj[person], dict):
                placement = incoming_conj[person].get("placement")
                marker = incoming_conj[person].get("marker")
                conjugations[backend_key] = _conj_entry(placement, marker)
            else:
                conjugations[backend_key] = ["default", "default"]

    has_articles = bool(data.get("has_articles", True))
    incoming_articles = data.get("articles") or {}
    articles = {
        "definite": incoming_articles.get("definite", ""),
        "indefinite": incoming_articles.get("indefinite", ""),
    }

    neg = data.get("negation") or ["before", ""]
    if isinstance(neg, (list, tuple)) and len(neg) >= 2:
        negation = [normalize_placement(neg[0]), neg[1] or ""]
    else:
        negation = ["before", ""]

    pl = data.get("pluralizer") or ["suffix", ""]
    if isinstance(pl, (list, tuple)) and len(pl) >= 2:
        pluralizer = [normalize_placement(pl[0]), pl[1] or ""]
    else:
        pluralizer = ["suffix", ""]


def translate_with_globals(sentence_key):
    return translate_sentence(
        sentence_key,
        words,
        sentence_order,
        question_order,
        user_name,
        tenses,
        has_conjugations,
        conjugations,
        has_articles,
        articles,
        negation,
        pluralizer,
        adj_placement,
    )


def build_all_sentences():
    return {key: translate_with_globals(key) for key in sentence_dict}


def build_english_labels():
    labels = dict(sentence_dict)
    name = (user_name or "").strip()
    if name:
        labels["intro"] = labels["intro"].replace("____", name)
    return labels


def build_sentence_package():
    return {
        "translations": build_all_sentences(),
        "english": build_english_labels(),
        "groups": {
            "dancing": list(dancing_sentences),
            "turtle": list(turtle_sentences),
            "apple": list(apple_sentences),
            "carrot": list(carrot_sentences),
        },
    }


# Pluralize a word
def pluralize(word, pluralizer):
    if pluralizer[0] == "before":
        return str(pluralizer[1] + " " + word)
    elif pluralizer[0] == "prefix":
        return str(pluralizer[1] + word)
    elif pluralizer[0] == "suffix":
        return str(word + pluralizer[1])
    elif pluralizer[0] == "after":
        return str(word + " " + pluralizer)

# Negate a word
def negate(word, negation):
    if negation[0] == "before":
        return str(negation[1] + " " + word)
    elif negation[0] == "prefix":
        return str(negation[1] + word)
    elif negation[0] == "suffix":
        return str(word + negation[1])
    elif negation[0] == "after":
        return str(word + " " + negation[1])

# Personal conjugations
def conjugate(word, has_conjugations, conjugations, conj_key):
    if has_conjugations == False:
        return word
    else:
        conj_set = conjugations[conj_key]
        if conj_set[1] == "default":
            return word
        else:
            conj_spot = conj_set[0]
            conj_word = conj_set[1]
            if conj_spot == "before":
                return str(conj_word + " " + word)
            elif conj_spot == "prefix":
                return str(conj_word + word)
            elif conj_spot == "suffix":
                return str(word + conj_word)
            elif conj_spot == "after":
                return str(word + " " + conj_word)

# Tenses
def tensify(word, tenses, tense_key):
    tense_set = tenses[tense_key]
    if tense_set[0] == "default":
        return word
    else:
        tense_spot = tense_set[0]
        tense_word = tense_set[1]
        if tense_spot == "before":
            return str(tense_word + " " + word)
        elif tense_spot == "prefix":
            return str(tense_word + word)
        elif tense_spot == "suffix":
            return str(word + tense_word)
        elif tense_spot == "after":
            return str(word + " " + tense_word)

# Add an article if needed
def add_article(word, has_articles, articles, article_key):
    if has_articles == False:
        return word
    else:
        return str(articles[article_key] + " " + word)


# Build subject for every sentence except intro
def make_subject(sentence_key, words, tenses, has_conjugations, conjugations, has_articles, articles, negation, pluralizer):
    if sentence_key == "dancing_yes" or sentence_key == "dancing_no" or sentence_key == "turtle_I" or sentence_key == "apple_past" or sentence_key == "apple_present" or sentence_key == "apple_future" or sentence_key == "the_carrot" or sentence_key == "the_carrots" or sentence_key == "a_carrot" or sentence_key == "carrots":
        return words["I"]
    elif sentence_key == "turtle_you":
        return words["you"]
    elif sentence_key == "turtle_she":
        return words["she"]
    elif sentence_key == "turtle_he":
        return words["he"]
    elif sentence_key == "turtle_they":
        return words["they"]
    elif sentence_key == "turtle_we":
        return words["we"]

# Build verb for everything except intro
def make_verb(sentence_key, words, has_conjugations, conjugations, tenses, negation):
    if sentence_key == "dancing_yes":
        verb = words["want"]
        verb = conjugate(verb, has_conjugations, conjugations, "first_single")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "dancing_no":
        verb = words["want"]
        verb = conjugate(verb, has_conjugations, conjugations, "first_single")
        verb = tensify(verb, tenses, "present")
        verb = negate(verb, negation)
    elif sentence_key == "turtle_I":
        verb = words["like"]
        verb = conjugate(verb, has_conjugations, conjugations, "first_single")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "turtle_you":
        verb = words["like"]
        verb = conjugate(verb, has_conjugations, conjugations, "second_person")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "turtle_she":
        verb = words["like"]
        verb = conjugate(verb, has_conjugations, conjugations, "third_single_female")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "turtle_he":
        verb = words["like"]
        verb = conjugate(verb, has_conjugations, conjugations, "third_single_male")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "turtle_they":
        verb = words["like"]
        verb = conjugate(verb, has_conjugations, conjugations, "third_plural")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "turtle_we":
        verb = words["like"]
        verb = conjugate(verb, has_conjugations, conjugations, "first_plural")
        verb = tensify(verb, tenses, "present")
    elif sentence_key == "apple_past" or sentence_key == "apple_present" or sentence_key == "apple_future":
        verb = words["eat"]
        verb = conjugate(verb, has_conjugations, conjugations, "first_single")
        if sentence_key == "apple_past":
            verb = tensify(verb, tenses, "past")
        elif sentence_key == "apple_present":
            verb = tensify(verb, tenses, "present")
        elif sentence_key == "apple_future":
            verb = tensify(verb, tenses, "future")
    elif sentence_key == "the_carrot" or sentence_key == "the_carrots" or sentence_key == "a_carrot" or sentence_key == "carrots":
        verb = words["enjoy"]
        verb = conjugate(verb, has_conjugations, conjugations, "first_single")
        verb = tensify(verb, tenses, "past")
    return verb

# Build object for every sentence except intro
def make_object(sentence_key, words, tenses, pluralizer, adj_placement, has_articles, articles):
    if sentence_key == "dancing_yes" or sentence_key == "dancing_no":
        obj = words["dance"]
        obj = tensify(obj, tenses, "infinitive")
    elif sentence_key == "turtle_I" or sentence_key == "turtle_he":
        adj = words["blue"]
        obj = pluralize(words["turtle"], pluralizer)
        if adj_placement == "before":
            obj = str(adj + " " + obj)
        else:
            obj = str(obj + " " + adj)
    elif sentence_key == "turtle_you" or sentence_key == "turtle_they":
        adj = words["tiny"]
        obj = pluralize(words["turtle"], pluralizer)
        if adj_placement == "before":
            obj = str(adj + " " + obj)
        else:
            obj = str(obj + " " + adj)
    elif sentence_key == "turtle_she" or sentence_key == "turtle_we":
        adj = words["fast"]
        obj = pluralize(words["turtle"], pluralizer)
        if adj_placement == "before":
            obj = str(adj + " " + obj)
        else:
            obj = str(obj + " " + adj)
    elif sentence_key == "apple_past" or sentence_key == "apple_present" or sentence_key == "apple_future":
        obj = words["apple"]
        obj = add_article(obj, has_articles, articles, "indefinite")
    elif sentence_key == "the_carrot":
        obj = words["carrot"]
        obj = add_article(obj, has_articles, articles, "definite")
    elif sentence_key == "the_carrots":
        obj = words["carrot"]
        obj = pluralize(obj, pluralizer)
        obj = add_article(obj, has_articles, articles, "definite")
    elif sentence_key == "a_carrot":
        obj = words["carrot"]
        obj = add_article(obj, has_articles, articles, "indefinite")
    elif sentence_key == "carrots":
        obj = words["carrot"]
        obj = pluralize(obj, pluralizer)
    return obj


# Put sentences in order (except intro)
def order_sentence(sentence_order, sub, verb, obj):
    if sentence_order == "SVO":
        sen = str(f"{sub} {verb} {obj}.")
    elif sentence_order == "SOV":
        sen = str(f"{sub} {obj} {verb}.")
    elif sentence_order == "VSO":
        sen = str(f"{verb} {sub} {obj}.")
    elif sentence_order == "VOS":
        sen = str(f"{verb} {obj} {sub}.")
    elif sentence_order == "OSV":
        sen = str(f"{obj} {sub} {verb}.")
    elif sentence_order == "OVS":
        sen = str(f"{obj} {verb} {sub}.")
    return sen

def make_intro(sentence_order, question_order, words, user_name):
    sen = str(f"{words["hello"].capitalize()}!")
    sub = str(f"{words["my"].capitalize()} {words["name"]}")
    verb = str(words["is"])
    obj = str((user_name or "").strip() or "friend")
    sen = str(f"{sen} {order_sentence(sentence_order, sub, verb, obj)}")
    if question_order == "wiyn":
        sen = str(f"{sen} {words["what"].capitalize()} {words["is"]} {words["your"]} {words["name"]}?")
    elif question_order == "wyni":
        sen = str(f"{sen} {words["what"].capitalize()} {words["your"]} {words["name"]} {words["is"]}?")
    elif question_order == "yniw":
        sen = str(f"{sen} {words["your"].capitalize()} {words["name"]} {words["is"]} {words["what"]}?")
    elif question_order == "ynwi":
        sen = str(f"{sen} {words['your'].capitalize()} {words['name']} {words['what']} {words['is']}?")
    return sen

def translate_sentence(sentence_key, words, sentence_order, question_order, user_name, tenses, has_conjugations, conjugations, has_articles, articles, negation, pluralizer, adj_placement):
    if sentence_key == "intro":
        sentence = make_intro(sentence_order, question_order, words, user_name)
    else:
        sub = make_subject(sentence_key, words, tenses, has_conjugations, conjugations, has_articles, articles, negation, pluralizer)
        verb = make_verb(sentence_key, words, has_conjugations, conjugations, tenses, negation)
        obj = make_object(sentence_key, words, tenses, pluralizer, adj_placement, has_articles, articles)
        sentence = order_sentence(sentence_order, sub, verb, obj)
    return sentence

